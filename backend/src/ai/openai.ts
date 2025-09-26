export const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

type ChatMessage =
    | { role: "system" | "user" | "assistant"; content: string }
    | { role: "tool"; content: string; tool_call_id?: string };

type ResponseFormat =
    | { type: "text" }
    | { type: "json_object" }
    | { type: "json_schema"; json_schema: { name: string; schema: any; strict?: boolean } };

type OpenAIJSONParams = {
    messages: ChatMessage[];
    model?: string;
    response_format?: ResponseFormat;     // 기본은 json_object로 설정됨
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
};

async function sleep(ms: number) { 
    return new Promise(r => setTimeout(r, ms)); 
}
export async function openaiJSON(params: OpenAIJSONParams) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
    }

    const model = params.model ?? MODEL;
    const rf: ResponseFormat =
        params.response_format?.type === "json_schema"
            ? params.response_format
            : params.response_format?.type === "text"
            ? { type: "text" }
            : { type: "json_object" };

    if (!Array.isArray(params.messages) || params.messages.length === 0) {
        throw new Error("messages 배열이 비어 있습니다.");
    }

    let lastErr: any = null;

    for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();                 
        const timer = setTimeout(() => controller.abort(), 30_000);

        try {
            const res = await fetch(OPENAI_URL, {
                method: "POST",
                signal: controller.signal,                    
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: params.messages,
                    response_format: rf,
                    temperature: params.temperature,
                    top_p: params.top_p,
                    max_tokens: params.max_tokens,
                }),
            });

            clearTimeout(timer);

            const text = await res.text();
            let data: any = null;
            try { data = JSON.parse(text); } catch {}

            if (!res.ok) {
                const errMsg =
                    data?.error?.message ??
                    data?.message ??
                    text ??
                    `HTTP ${res.status}`;
                const detail = {
                    status: res.status,
                    type: data?.error?.type,
                    code: data?.error?.code,
                    param: data?.error?.param,
                    message: errMsg,
                };

                if ((res.status === 429 || (res.status >= 500 && res.status < 600)) && attempt === 0) {
                    await sleep(600 + Math.random() * 400);
                    continue;
                }
                throw new Error(`OpenAI error ${res.status}: ${JSON.stringify(detail)}`);
            }

            const choice = data?.choices?.[0]?.message;
            const content =
                choice?.content ??
                data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
                "";

            if (rf.type === "json_object" || rf.type === "json_schema") {
                try {
                    return JSON.parse(content || "{}");
                } catch {
                    throw new Error(`모델이 JSON이 아닌 응답을 반환했습니다: ${String(content).slice(0, 200)}`);
                }
            } else {
                return { text: String(content ?? "") };
            }
        } catch (err: any) {
            clearTimeout(timer);                                  // ★ 누락 방지
            lastErr = err.name === "AbortError"
                ? new Error("OpenAI 요청이 타임아웃(30s)되었습니다.")
                : err;

            if (attempt === 0) {
                await sleep(500);
                continue;
            }
        }
    }

    throw lastErr;
}
