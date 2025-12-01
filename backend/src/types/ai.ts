export type NodeItem = { title: string };

export type IdeaItem = {
    title: string;
    steps: string[];
    expectedOutcome: string;
};

export type IdeasPayload = {
    topic: string;
    overview: string;
    keywords: string[];
    news: Array<{ title: string; url: string }>;
    ideas: IdeaItem[];
};
