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
        properties: {
            keywords: { type: "array", items: { type: "string" } },
        },
        required: ["keywords"],
        additionalProperties: false,
    };

    const j: { keywords: string[] } = await openaiJSON({
        model: MODEL,
        temperature: 0.4,
        response_format: {
            type: "json_schema",
            json_schema: { name: "Keywords", schema, strict: true },
        },
        messages: [
            { role: "system", content: sys },
            { role: "user", content: usr },
        ],
        max_tokens: 200,
    });

    return uniqueLimit(j.keywords ?? [], need);
}

export async function expandNodes(text: string, n = 3) {
    const need = clamp(n, 1, 10);
    const sys = "너는 아이디어 확장 도우미다. 기존 노드에서 파생되는 새 노드 '제목'만 제안해.";
    const usr = `기존 노드: "${text}"
                원하는 개수: ${need}
                형식: {"nodes":["제안1","제안2","제안3"]}`;

    const schema = {
        type: "object",
        properties: {
            nodes: { type: "array", items: { type: "string" } },
        },
        required: ["nodes"],
        additionalProperties: false,
    };

    const j: { nodes: string[] } = await openaiJSON({
        model: MODEL,
        temperature: 0.6,
        response_format: {
            type: "json_schema",
            json_schema: { name: "ExpandNodes", schema, strict: true },
        },
        messages: [
            { role: "system", content: sys },
            { role: "user", content: usr },
        ],
        max_tokens: 200,
    });

    return uniqueLimit(j.nodes ?? [], need);
}

type Idea = {
    title: string;
    steps: string[];
    expectedOutcome: string;
};

export async function generateIdeas(topic: string, news: NewsItem[], count = 3) {
    const need = clamp(count, 1, 10);
    const summaries =
        news?.length
            ? news
            .map((n, i) =>`#${i + 1} ${n.title} (${n.source ?? "unknown"}, ${n.publishedAt ?? "N/A"})`).join("\n"): "(자료 없음)";
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
        response_format: {
            type: "json_schema",
            json_schema: { name: "GenerateIdeas", schema, strict: true },
        },
        messages: [
            { role: "system", content: sys },
            { role: "user", content: usr },
        ],
        max_tokens: 800,
    });

    const ideas = Array.isArray(j.ideas) ? j.ideas : [];
    return ideas.slice(0, need).map((it) => ({
        title: String(it.title ?? "").trim(),
        steps: (it.steps ?? []).map((s) => String(s ?? "").trim()).filter(Boolean).slice(0, 5),
        expectedOutcome: String(it.expectedOutcome ?? "").trim(),
    }));
}

export async function buildNodePayload(topic: string, opts?: { newsLimit?: number }) {
    const limit = clamp(opts?.newsLimit ?? 5, 1, 10);

    const [keywords, news] = await Promise.all([
        suggestKeywords(topic, 8),
        fetchNews(topic, limit),
    ]);

    const ideas = await generateIdeas(topic, news, 3);

    return { topic, keywords, news, ideas };
}
