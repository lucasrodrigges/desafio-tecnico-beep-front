export interface Comment {
  by: string;
  id: number;
  parent?: number;
  text: string;
  time: number;
  type: string;
  kids?: number[];
}

export interface Story {
  by: string;
  descendants: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url?: string;
  comments?: Comment[];
}
