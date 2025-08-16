import { UserResponse } from './users';

export interface Chronology {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  checksum?: string;
  createdAt: string;
  uploadedBy: UserResponse;
}

export type FileType = 'IM' | 'EX';

export interface DownloadFile {
  fileId: number;
  type: FileType;
  vlereValue?: string;
}
