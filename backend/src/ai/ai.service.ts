import { openaiJSON, MODEL } from "./openai";
import { fetchNews, type NewsItem } from "./news.service";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function uniqueLimit(values: unknown[], count: number) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of values ?? []) {
        const s = String(v ?? "").trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        out.push(s);
        if (out.length >= count) break;
    }
    return out;
}

export async function suggestKeywords(topic: string, count = 8) {
    const need = clamp(count, 1, 20);
    const sys = "너는 한국어 정보 검색 전문가다. 키워드는 짧게, 중복 없이.";
    const usr = `주제: "${topic}"
                필요: 검색에 바로 쓸 수 있는 연관 키워드 ${need}개.
                형식: {"keywords":["키워드1","키워드2",...]} (JSON만)`;

    const schema = {
        type: "object",
        properties: { keywords: { type: "array", items: { type: "string" } } },
        required: ["keywords"],
        additionalProperties: false,
    };

    const j: { keywords: string[] } = await openaiJSON({
        model: MODEL,
        temperature: 0.4,
        response_format: { type: "json_schema", json_schema: { name: "Keywords", schema, strict: true } },
        messages: [{ role: "system", content: sys }, { role: "user", content: usr }],
        max_tokens: 200,
    });

    return uniqueLimit(j.keywords ?? [], need);
}

export async function expandNodes(text: string, n = 3) {
    const need = clamp(n, 1, 10);

    const banlist = ["아이디어 발전", "창의적 사고", "문제 해결 전략", "혁신", "최적화", "고도화"];

    const sys = [
        "너는 제품 아이디어 확장 도우미다.",
        "반드시 주제와 직접적으로 연관된, 구체적인 하위 주제 '제목'만 생성한다.",
        "각 제목은 8~22자 사이의 한국어 명사구 형태여야 한다.",
        `다음 금지어/유사표현은 절대 포함하지 않는다: ${banlist.join(", ")}`,
        "너무 일반적이거나 추상적인 표현(예: 혁신, 최적화, 전략, 개선, 발전)은 금지한다.",
    ].join(" ");

    const usr = [
        `기존 노드(상위 주제): "${text}"`,
        `원하는 개수: ${need}`,
        `형식(JSON만): {"nodes":["하위주제1","하위주제2","하위주제3"]}`,
        "각 하위주제는 상위 주제의 특정 영역/타깃/사용처/기능/도구/워크플로우로 좁혀서 작성한다.",
        "브랜드/회사명/사람 이름은 사용하지 않는다.",
    ].join("\n");

    const schema = {
        type: "object",
        properties: {
            nodes: { type: "array", items: { type: "string" }, minItems: need, maxItems: need },
        },
        required: ["nodes"],
        additionalProperties: false,
    };

    const j: { nodes: string[] } = await openaiJSON({
        model: MODEL,
        temperature: 0.8,              
        response_format: {
            type: "json_schema",
            json_schema: { name: "ExpandNodes", schema, strict: true },
        },
        messages: [
            { role: "system", content: sys },
            { role: "user", content: usr },
        ],
        max_tokens: 250,
    });
    console.log("[expandNodes][raw]", j);
    
    let titles = uniqueLimit(j.nodes ?? [], need);
    console.log("[expandNodes][raw]", titles);
    
    const isGeneric = (s: string) => {
        if (!s) return true;
        const short = s.replace(/\s+/g, "");
        if (short.length < 4) return true;
        const genericWords = ["아이디어", "전략", "개선", "고도화", "최적화", "혁신", "창의", "문제 해결"];
        return banlist.some(b => s.includes(b)) || genericWords.some(g => s.includes(g));
    };

    titles = titles.filter(t => !isGeneric(t));

    while (titles.length < need) {
        // 주제 기반 구체 템플릿
        const candidates = [
            `${text} 자동화 도구`,
            `${text} 학습 커리큘럼`,
            `${text} 품질 측정 지표`,
            `${text} 협업 워크플로우`,
            `${text} 데이터 파이프라인`,
            `${text} 온보딩 경험`,
            `${text} 실시간 피드백`,
        ];
        const next = candidates.find(c => !titles.includes(c));
        if (!next) break;
        titles.push(next);
    }

    titles = titles.slice(0, need);

    return titles.map(title => ({ title }));
}


type Idea = { title: string; steps: string[]; expectedOutcome: string };

export async function generateIdeas(topic: string, news: NewsItem[], count = 3) {
    const need = clamp(count, 1, 10);
    const summaries =
        news?.length
            ? news.map((n, i) => `#${i + 1} ${n.title} (${n.source ?? "unknown"}, ${n.publishedAt ?? "N/A"})`).join("\n")
            : "(자료 없음)";

    const sys = "너는 아이디어 기획 보조자다. 간결하고 실행 가능하게.";
    const usr = `주제: "${topic}"
                최근 기사 요약: ${summaries}
                요청: 실행 아이디어 ${need}개.
                형식: {"ideas":[{"title":"...","steps":["2~5개"],"expectedOutcome":"..."}]}`;

    const schema = {
        type: "object",
        properties: {
            ideas: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        steps: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                        expectedOutcome: { type: "string" },
                    },
                    required: ["title", "steps", "expectedOutcome"],
                    additionalProperties: false,
                },
            },
        },
        required: ["ideas"],
        additionalProperties: false,
    };

    const j: { ideas: Idea[] } = await openaiJSON({
        model: MODEL,
        temperature: 0.6,
        response_format: { type: "json_schema", json_schema: { name: "GenerateIdeas", schema, strict: true } },
        messages: [{ role: "system", content: sys }, { role: "user", content: usr }],
        max_tokens: 800,
    });

    const ideas = Array.isArray(j.ideas) ? j.ideas : [];
    return ideas.slice(0, need).map((it) => ({
        title: String(it.title ?? "").trim(),
        steps: (it.steps ?? []).map((s) => String(s ?? "").trim()).filter(Boolean).slice(0, 5),
        expectedOutcome: String(it.expectedOutcome ?? "").trim(),
    }));
}

export async function generateOverview(topic: string): Promise<string> {
    const sys = "너는 개념 설명가다. 주제에 대한 2~3문장 개요를 간단히 써라.";
    const usr = `주제: "${topic}"
                형식: {"overview":"..."} (JSON만)`;

    const schema = {
        type: "object",
        properties: { overview: { type: "string" } },
        required: ["overview"],
        additionalProperties: false,
    };

    const j: { overview: string } = await openaiJSON({
        model: MODEL,
        temperature: 0.5,
        response_format: { type: "json_schema", json_schema: { name: "Overview", schema, strict: true } },
        messages: [{ role: "system", content: sys }, { role: "user", content: usr }],
        max_tokens: 300,
    });

    return String(j.overview ?? "").trim();
}

export async function buildNodePayload(topic: string, opts?: { newsLimit?: number }) {
    const limit = clamp(opts?.newsLimit ?? 5, 1, 10);

    const [overview, keywords, news] = await Promise.all([
        generateOverview(topic),
        suggestKeywords(topic, 8),
        fetchNews(topic, limit),
    ]);

    const ideas = await generateIdeas(topic, news, 3);
    return { topic, overview, keywords, news, ideas };
}

export async function oneLineSuggestion(text: string): Promise<string> {
    const sys = "너는 제품 아이디어 보조자다. 주제를 한 줄의 새로운 제안으로 간결히 바꿔라.";
    const usr = `기존: "${text}"
                형식: {"suggestion":"한 줄 제안"}`;

    const schema = {
        type: "object",
        properties: { suggestion: { type: "string" } },
        required: ["suggestion"],
        additionalProperties: false,
    };

    const j: { suggestion: string } = await openaiJSON({
        model: MODEL,
        temperature: 0.7,
        response_format: { type: "json_schema", json_schema: { name: "OneLine", schema, strict: true } },
        messages: [{ role: "system", content: sys }, { role: "user", content: usr }],
        max_tokens: 120,
    });

    return String(j.suggestion ?? "새 아이디어").trim();
}