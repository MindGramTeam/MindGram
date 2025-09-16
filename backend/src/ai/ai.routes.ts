import { Router } from "express";
import { z } from "zod";
import { buildNodePayload } from "./ai.service";

const router = Router();

router.get("/node", async(req, res) => {
    const schema = z.object({
        topic: z.string().min(1),
        limit : z.coerce.number().int().min(1).max(10).optional(),
    });

    const parsed = schema.safeParse({ topic: req.query.topic, limit: req.query.limit });
    if (!parsed.success) {
        return res.status(422).json({ message: "입력값이 유효하지 않습니다.", issues: parsed.error.issues });
    }

    const { topic, limit } = parsed.data;
    try {
        const data = await buildNodePayload(topic, { newsLimit: limit ?? 5});
        return res.json(data);
    } catch ( e: any ){
        console.error(e);
        return res.status(500).json({ message: "AI 처리 중 오류가 발생했습니다."  });
    }
});

export default router;
