// src/ai/ai.routes.ts
import { Router } from "express";
import { z } from "zod";
import { buildNodePayload, expandNodes, suggestKeywords } from "./ai.service";

const router = Router();

// 노드 확장
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
        return res.json({ 
            nodes, expansions: nodes 
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ 
            message: "AI 처리 중 오류가 발생했습니다." 
        });
    }
});

router.post("/keywords", async (req, res) => {
    const schema = z.object({
        topic: z.string().min(1),
        count: z.number().int().min(1).max(20).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(422).json({
            message: "입력값이 유효하지 않습니다.",
            issues: parsed.error.issues,
        });
    }

    try {
        const { topic, count } = parsed.data;
        const keywords = await suggestKeywords(topic, count ?? 8);
        return res.json({ keywords });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

router.post("/ideas", async (req, res) => {
    const schema = z.object({
        topic: z.string().min(1),
        newsLimit: z.number().int().min(1).max(10).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(422).json({
            message: "입력값이 유효하지 않습니다.",
            issues: parsed.error.issues,
        });
    }

    try {
        const { topic, newsLimit } = parsed.data;
        const payload = await buildNodePayload(topic, { newsLimit: newsLimit ?? 5 });
        return res.json(payload); // { topic, keywords, news, ideas }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

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

    const { topic, limit } = parsed.data;

    try {
        const data = await buildNodePayload(topic, { newsLimit: limit ?? 5 });
        return res.json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

router.get("/random", async (req, res) => {
    const pool = [
        "AI 튜터",
        "헬스케어 코칭",
        "친환경 포장",
        "스마트팜",
        "반려동물 케어",
        "개인 금융 관리",
        "창업 아이디어 발굴",
    ];

    const topic = pool[Math.floor(Math.random() * pool.length)];

    try {
        const data = await buildNodePayload(topic, {
            newsLimit: Number(req.query.limit ?? 5),
        });
        return res.json({ ...data, topic });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다." });
    }
});

export default router;
