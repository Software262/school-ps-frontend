import { fetchApi } from '@shared/api/apiClient';
import type {
  CertificateDetail,
  GenerateResponse,
  SearchStudent,
  SearchTeacher,
  StudentStatusResult,
} from '@/features/paz-y-salvo/model/types';

interface ApiWrapper<T> {
  statusCode: number;
  data: T;
  message: string;
  details: unknown;
}

export const searchStudents = (query: string) =>
  fetchApi<ApiWrapper<{ items: SearchStudent[] }>>(
    `/peace-safe/search-students?q=${encodeURIComponent(query)}`,
  ).then((res) => res.data.items);

export const searchTeachers = (query: string) =>
  fetchApi<ApiWrapper<{ items: SearchTeacher[] }>>(
    `/peace-safe/search-teachers?q=${encodeURIComponent(query)}`,
  ).then((res) => res.data.items);

export const getStudentStatus = (estudianteId: number) =>
  fetchApi<ApiWrapper<StudentStatusResult>>(
    `/peace-safe/student/${String(estudianteId)}/status`,
  ).then((res) => res.data);

export const getTeacherStatus = (docenteId: number) =>
  fetchApi<ApiWrapper<StudentStatusResult>>(`/peace-safe/teacher/${String(docenteId)}/status`).then(
    (res) => res.data,
  );

export const generateStudentPazYSalvo = (estudianteId: number) =>
  fetchApi<ApiWrapper<GenerateResponse>>(
    `/peace-safe/student/${String(estudianteId)}/generate?usuario_id=1`,
    { method: 'POST' },
  ).then((res) => res.data);

export const generateTeacherPazYSalvo = (docenteId: number) =>
  fetchApi<ApiWrapper<GenerateResponse>>(
    `/peace-safe/teacher/${String(docenteId)}/generate?usuario_id=1`,
    { method: 'POST' },
  ).then((res) => res.data);

export const getCertificateDetail = (pazysalvoId: number) =>
  fetchApi<ApiWrapper<CertificateDetail>>(`/peace-safe/${String(pazysalvoId)}`).then(
    (res) => res.data,
  );
