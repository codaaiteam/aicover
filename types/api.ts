export interface ApiResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

export interface Video {
  id: string;
  uuid: string;
  img_url: string;
  img_description: string;
  created_at: string;
  url?: string;
  title?: string;
}

export interface GenerateVideoResponse {
  url: string;
  id?: string;
}
