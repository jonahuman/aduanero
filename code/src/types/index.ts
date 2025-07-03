export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Document {
  id: string;
  userId: string;
  type: 'passport' | 'id_card';
  documentNumber: string;
  expirationDate: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface UploadDocumentRequest {
  userId: string;
  type: 'passport' | 'id_card';
  documentNumber: string;
  expirationDate: string;
  file: File;
}

export interface CustomsRecord {
  id: string;
  userId: string;
  user: User;
  documents: Document[];
  status: 'activo' | 'inactivo' | 'pendiente';
  processedAt: string;
  notes?: string;
}

export interface CustomsStats {
  users: {
    total: number;
  };
  documents: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  customs_records: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
  };
}

export interface SetupStatus {
  database_connected: boolean;
  admin_exists: boolean;
  setup_complete: boolean;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  phoneNumber?: string;
  address?: string;
}

export type FilterStatus = 'todos' | 'activo' | 'inactivo' | 'pendiente';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pages: number;
  current_page: number;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}