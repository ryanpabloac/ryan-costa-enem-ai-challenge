export interface Weights {
  humanities?: number;
  mathematics?: number;
  science?: number;
  language?: number;
  essay?: number;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  targetCourse?: string;
  targetUniversity?: string;
  weights?: Weights;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  targetCourse?: string;
  targetUniversity?: string;
  weights?: Weights;
}

export interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  message?: string;
  instance?: string;
  issues?: Array<{ message: string; path?: string[] }>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly problem?: ProblemDetail;

  constructor(message: string, status = 500, problem?: ProblemDetail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail: ProblemDetail | null = null;
    try {
      errorDetail = await response.json();
    } catch {
      // Body não era JSON
    }

    let errorMessage = 'Ocorreu um erro na requisição. Tente novamente.';

    if (errorDetail?.detail) {
      errorMessage = errorDetail.detail;
    } else if (errorDetail?.title) {
      errorMessage = errorDetail.title;
    } else if (errorDetail?.message) {
      errorMessage = errorDetail.message;
    } else if (errorDetail?.issues && errorDetail.issues.length > 0) {
      errorMessage = errorDetail.issues[0].message;
    } else if (response.status === 400) {
      errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
    } else if (response.status === 401) {
      errorMessage = 'Não autorizado. Verifique suas credenciais.';
    } else if (response.status === 409) {
      errorMessage = 'Este e-mail já está cadastrado na plataforma.';
    } else if (response.status >= 500) {
      errorMessage = 'Serviço indisponível no momento. Tente novamente mais tarde.';
    }

    throw new ApiError(errorMessage, response.status, errorDetail || undefined);
  }

  // Tratamento de respostas sem corpo (ex: 201 ou 204)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return {} as T;
}

export const api = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async register(payload: RegisterPayload): Promise<void> {
    return request<void>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(token: string): Promise<User> {
    return request<User>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
