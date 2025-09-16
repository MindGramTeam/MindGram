import { openai, MODEL } from './openai';
import { fetchNews } from './new.service';

export async function suggestKeywords(topic: string, count = 8) {
    const sys = "너는 한국어 정복검색 전문가다. 키워드는 짧게, 중법 없이.";
    
    const usr = `주제: "${topic}" 
    필요: 검색어 바로 쓸 수 있는 연관 키워드 ${count}게.
    형식: ["키워드1", "키워드2",...] (JSON 배열만)`;

    const r = await openai.caht.completion.create({
        model: MODEL, 
        temperature: 0.5,
        message: [{ role: "system", content: sys}, {role: "user", content: usr}],
        response_format: { type: "json_object"}
    });

    const raw = r.choives[0]?.message?.content ?? "{}";
    const j = JSON.parse(raw);
    const arr = j.array ?? j.keywords ?? j.result ?? [];
    return Array.isArray(arr) ? arr.slice(0, count) : [];
}

export async function generateIdeas(topic: string, news: NewsItem[], count = 3){
    const summaries = news.map((n, i) => `#${i+1} ${n.title} (${n.source}, ${n.publishedAt})`).join("\n");
    const sys = "너는 아이디어 기획 보조자다. 간결하고 실행 가능하게.";
    const usr = `주제: ${topic}"
    최근 기사 요약 : ${summaries || "(자료 없음)" }
    요청 : 실행 아이디어 ${count}개. 각 항목은 title, steps(2~5개), expectedOutcome":"..."}]}`;
    
    const r = await openai.chat.completion.create({
        model: MODEL,
        temperature: 0.6,
        message: [{ role: "system", content: sys }, {role:"user", contest: usr}],
        response_format: {type: "json_object"}
    });

    const raw = r.choices[0]?.message?.content ?? `{"ideas": []}`;
    
    return JSON.parse(raw).ideas ?? [];
}

export async function buildNodePayload(topic: string, opts? : {newsLimit? : number}) {
    const limit = Math.min(Math.max(opts?.newsLimit ?? 5, 1), 10);
    const [keywords, news] = await Promise.all([
        suggestKeywords(topic, 8),
        fetchNews(topic, limit),
    ]);

    const ideas = await generateIdeas(topic, news, 3);

    return { topic, keywords, news, ideas};
}