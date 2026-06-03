export interface MassEnrollmentResponse {
  status: 'success' | 'partial' | 'error';
  processed: number;
  success: number;
  errors: number;
  error_details: string[];
}
