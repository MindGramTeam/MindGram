import axios from 'axios';
import { getCache, setCache } from './cache.service';

export type NewsItem = {
    title: string;
    url : string;
    source: string;
    publishedAt: string;
    summary?: string;
};

function key(topic: string, limit: number ){
    return `news:${topic}:${limit}`;
}

export async function fetchNews(topic: string, limit = 5 ): Promise<NewsItem[]> {
    const k = key(topic, limit);
    const cached = getCache<NewsItem[]>(k);
    if ( cached ) return cached;

    const naverKey  = process.env.NAVER_NEWS_API_KEY;
    if(!naverKey) return [];

    const resp = await axios.get('https://openapi.naver.com/v1/search/news.json', {
        params: {
            q: topic, 
            mkt: 'ko-KR', 
            count: limit, 
            freshness: "week",
            sortBy: "Date"
        }, 
        headers : {
            "Ocp-Apim-Subscription-Key": naverKey
        },
    });

    const items: NewsItem[] = (resp.data.value ?? []).map( (v : any) => ({
        title: v.name,
        url: v.url,
        source: v.datePublished?.[0].name ?? 'N/A',
        publishedAt: v.datePublished ?? new Date().toISOString(),
    }));

    setCache(k, items);
    return items;
}