/** Standard API response wrapper from the backend */
export interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
  message: string;
  details: string | null;
}
