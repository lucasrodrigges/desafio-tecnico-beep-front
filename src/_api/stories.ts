import type { Comment, Story } from "@/_types/story";
import { get } from "@/_utils/fetchApi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchTopStories(): Promise<Story[]> {
  const res = await get<Story[]>(`${BASE_URL}/hackernews/top_stories`);
  if (res.error) return [];
  return res.data || []
}

async function searchStories(query: string): Promise<Story[]> {
  const res = await get<Story[]>(`${BASE_URL}/hackernews/search?query=${encodeURIComponent(query)}`);
  if (res.error) return [];
  return res.data || []
}

async function fetchRepliesAtComments(ids: number[]): Promise<Comment[]> {
  const res = await get<Comment[]>(`${BASE_URL}/hackernews/replies_at_comments?ids=${encodeURIComponent(ids.join(','))}`);
  if (res.error) return [];
  return res.data || []
}

export default {
  fetchTopStories,
  searchStories,
  fetchRepliesAtComments
}
