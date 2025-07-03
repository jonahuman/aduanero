import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  CreateUserRequest, 
  Document, 
  CustomsRecord, 
  CustomsStats, 
  SetupStatus, 
  CreateAdminRequest,
  PaginatedResponse,
  Activity 
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        let message = 'Algo salió mal. Inténtalo de nuevo.';
        
        if (error.response?.status === 401) {
          message = 'Usuario o contraseña incorrectos';
        } else if (error.response?.status === 403) {
          message = 'No tienes permisos para hacer esto';
        } else if (error.response?.status === 404) {
          message = 'No se encontró lo que buscas';
        } else if (error.response?.status === 500) {
          message = 'Hay un problema en el sistema. Inténtalo más tarde';
        } else if (error.response?.data?.error) {
          message = error.response.data.error;
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        
        throw new Error(message);
      }
    );
  }

  private async request(endpoint: string, options: AxiosRequestConfig = {}) {
    return await this.api.request({ url: endpoint, ...options });
  }

  // Autenticación
  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    const response = await this.request('/auth/login', {
      method: 'POST',
      data: loginData,
    });

    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  async verifyToken(): Promise<{ user: User }> {
    return await this.request('/auth/verify');
  }

  // Usuarios
  async createUser(userData: CreateUserRequest): Promise<{ message: string; user: User }> {
    return await this.request('/users/', {
      method: 'POST',
      data: userData,
    });
  }

  async getUsers(page = 1, per_page = 10, search = ''): Promise<PaginatedResponse<User> & { users: User[] }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
    });
    return await this.request(`/users/?${params}`);
  }

  async getUser(userId: string): Promise<{ user: User }> {
    return await this.request(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<CreateUserRequest>): Promise<{ message: string; user: User }> {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      data: userData,
    });
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Documentos
  async uploadDocument(formData: FormData) {
    return await this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getUserDocuments(userId: string) {
    return await this.request(`/documents/user/${userId}`);
  }

  async reviewDocument(documentId: string, status: string, notes = '') {
    return await this.request(`/documents/${documentId}/review`, {
      method: 'PUT',
      data: { status, notes },
    });
  }

  async getAllDocuments(page = 1, per_page = 10, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(status && { status }),
    });
    return await this.request(`/documents/?${params}`);
  }

  async deleteDocument(documentId: string) {
    return await this.request(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Registros Aduaneros
  async createCustomsRecord(data: any) {
    return await this.request('/customs/records', {
      method: 'POST',
      data,
    });
  }

  async getCustomsRecords(page = 1, per_page = 10, status = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(status && status !== 'todos' && { status }),
      ...(search && { search }),
    });
    return await this.request(`/customs/records?${params}`);
  }

  async getCustomsRecord(recordId: string) {
    return await this.request(`/customs/records/${recordId}`);
  }

  async updateCustomsRecord(recordId: string, data: any) {
    return await this.request(`/customs/records/${recordId}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteCustomsRecord(recordId: string) {
    return await this.request(`/customs/records/${recordId}`, {
      method: 'DELETE',
    });
  }

  async getCustomsStats(): Promise<CustomsStats> {
    return await this.request('/customs/stats');
  }

  async processUserRegistration(userData: any, documents: any) {
    return await this.request('/customs/process-user', {
      method: 'POST',
      data: { userData, documents },
    });
  }

  // Salud y configuración
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return await this.request('/health');
  }

  async checkSetup(): Promise<SetupStatus> {
    return await this.request('/setup/check');
  }

  async createAdmin(adminData: CreateAdminRequest): Promise<{ message: string }> {
    return await this.request('/setup/admin', {
      method: 'POST',
      data: adminData,
    });
  }

  async deleteAdmin(email: string): Promise<{ message: string }> {
    return await this.request('/setup/delete-admin', {
      method: 'DELETE',
      data: { email },
    });
  }

  // Actividad reciente
  async getRecentActivity(limit = 10): Promise<{ activities: Activity[]; total: number }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    return await this.request(`/activity/recent?${params}`);
  }

  async getActivitySummary(): Promise<{ today: { users: number; documents: number; records: number }; date: string }> {
    return await this.request('/activity/summary');
  }

  async toggleCustomsRecordStatus(recordId: string): Promise<{ message: string; record: CustomsRecord }> {
    return await this.request(`/customs/records/${recordId}/toggle-status`, {
      method: 'PUT',
      data: {},
    });
  }
}

export const apiService = new ApiService();