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

export interface DownloadFile {
  fileId: number;
  mode: string;
  vlereValue?: string;
}
