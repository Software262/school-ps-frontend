import type { Sport } from '@/entities/sport/model/type';

export interface PaginationLoadSport {
  statusCode: number;
  data: {
    items: Sport[];
    current_page: number;
    page_size: number;
  };
  message: string;
  details?: string | null;
}
