import { NextResponse } from 'next/server'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${this.baseUrl}${endpoint}`
    
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient()

// Typed API methods
export const apiClient = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string) =>
      api.post('/auth/register', { name, email, password }),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
  },

  // Subjects
  subjects: {
    list: () => api.get('/subjects'),
    create: (name: string) => api.post('/subjects', { name }),
    delete: (id: string) => api.delete(`/subjects/${id}`),
  },

  // Sessions
  sessions: {
    list: () => api.get('/sessions'),
    create: (data: {
      subjectId: string
      durationMinutes: number
      type: '50min' | '25min' | 'free'
    }) => api.post('/sessions', data),
  },

  // Goals
  goals: {
    get: () => api.get('/goals'),
    update: (targetHours: number) => api.post('/goals', { targetHours }),
  },

  // Notes
  notes: {
    list: () => api.get('/notes'),
    get: (date: string) => api.get('/notes', { date }),
    upsert: (date: string, content: string) =>
      api.post('/notes', { date, content }),
  },
}
