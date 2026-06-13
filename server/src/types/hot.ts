export interface HotItem {
  rank: number;
  title: string;
  url: string;
  heat?: string;
  extra?: Record<string, unknown>;
}

export interface HotPlatform {
  source: string;
  sourceName: string;
  listName: string;
  updatedAt: string;
  items: HotItem[];
  error?: boolean;
  message?: string;
  fromCache?: boolean;
}

export interface HotAggregateResponse {
  platforms: HotPlatform[];
}
