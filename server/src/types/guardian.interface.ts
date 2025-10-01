export interface GuardianResponse {
  response: Response;
}

export interface Response {
  status: string;
  userTier: string;
  total: number;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: string;
  results: Result[];
}

export interface Result {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: Date;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields: Fields;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
}

export interface Fields {
  trailText: string;
  thumbnail: string;
}
