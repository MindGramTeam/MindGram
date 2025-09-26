import { Router } from "express";
import { z } from "zod";
import {
    expandNodes,
    buildNodePayload,
    oneLineSuggestion,
} from "./ai.service";

const router = Router();

// node expand
router.post("/expand", async (req, res) => {
    const schema = z.object({
        text: z.string().min(1),
        n: z.number().int().min(1).max(10).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(422).json({
            message: "입력값이 유효하지 않습니다.",
            issues: parsed.error.issues,
        });
    }

    try {
        const { text, n } = parsed.data;
        const nodes = await expandNodes(text, n ?? 3);
        return res.json({ nodes, expansions: nodes });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

// node
router.get("/node", async (req, res) => {
    const schema = z.object({
        topic: z.string().min(1),
        limit: z.coerce.number().int().min(1).max(10).optional(),
    });

    const parsed = schema.safeParse({
        topic: req.query.topic,
        limit: req.query.limit,
    });

    if (!parsed.success) {
        return res.status(422).json({
            message: "입력값이 유효하지 않습니다.",
            issues: parsed.error.issues,
        });
    }

    try {
        const { topic, limit } = parsed.data;
        const payload = await buildNodePayload(topic, { newsLimit: limit ?? 5 });
        return res.json(payload);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

// node 호환용 /expand
router.post("/compat/expand", async (req, res) => {
    try {
        const text = String(req.body?.text ?? "").trim();
        if (!text) {
            return res.status(422).json({ message: "text가 필요합니다." });
        }
        const suggestion = await oneLineSuggestion(text);
        return res.json({ suggestion });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

router.get("/_debug", (req, res) => {
    const key = process.env.OPENAI_API_KEY ?? "";
    const model = process.env.OPENAI_MODEL ?? "(defulat:gpt-4o-mini)";
    return res.json({
        haskey: Boolean(key),
        keyPrefix: key ? key.slice(0, 6) : "",
        model,
    });
});

export default router;
