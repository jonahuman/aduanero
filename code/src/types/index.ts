export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
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
}

export interface CustomsRecord {
  id: string;
  userId: string;
  user: User;
  documents: Document[];
  status: 'todos' | 'activo' | 'inactivo' | 'pendiente';
  processedAt: string;
  notes?: string;
}

export type FilterStatus = 'todos' | 'activo' | 'inactivo' | 'pendiente';