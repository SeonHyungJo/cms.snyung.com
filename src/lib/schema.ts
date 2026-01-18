import { z } from 'zod';

// 파일 저장 요청 스키마
export const saveFileSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  content: z.string(), // 빈 문자열도 허용 (내용 지울 수 있음)
});

export type SaveFileRequest = z.infer<typeof saveFileSchema>;

// 파일 읽기 요청 스키마
export const readFileSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
});

export type ReadFileRequest = z.infer<typeof readFileSchema>;

// 파일 목록 요청 스키마
export const listFilesSchema = z.object({
  folderId: z.string().optional().default("root"),
});

export type ListFilesRequest = z.infer<typeof listFilesSchema>;

// Google Drive 파일 타입
export const driveFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  modifiedTime: z.string().optional(),
  size: z.string().optional(),
});

export type DriveFile = z.infer<typeof driveFileSchema>;

// API 응답 스키마
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
