import { Aula, Alerta, CreateAulaDto, UpdateAulaDto, Estadisticas } from '../types';

// Usar URL completa del backend en lugar de proxy
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Aulas
export async function crearAula(dto: CreateAulaDto): Promise<Aula> {
  return fetchApi<Aula>('/aulas', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function obtenerAulas(): Promise<Aula[]> {
  return fetchApi<Aula[]>('/aulas');
}

export async function obtenerAula(id: string): Promise<Aula> {
  return fetchApi<Aula>(`/aulas/${id}`);
}

export async function actualizarAula(id: string, dto: UpdateAulaDto): Promise<Aula> {
  return fetchApi<Aula>(`/aulas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function eliminarAula(id: string): Promise<void> {
  await fetchApi(`/aulas/${id}`, {
    method: 'DELETE',
  });
}

// Alertas
export async function obtenerAlertas(aulaId?: string): Promise<Alerta[]> {
  const endpoint = aulaId ? `/alertas?aulaId=${aulaId}` : '/alertas';
  return fetchApi<Alerta[]>(endpoint);
}

export async function resolverAlerta(id: string, resolutionNotes?: string): Promise<void> {
  await fetchApi(`/alertas/${id}/resolver`, {
    method: 'PATCH',
    body: JSON.stringify({ resolutionNotes }),
  });
}

// Historial
export async function obtenerHistorial(aulaId: string): Promise<Aula['historialConsumo']> {
  return fetchApi<Aula['historialConsumo']>(`/historial/${aulaId}`);
}

export async function obtenerEstadisticas(aulaId: string): Promise<Estadisticas> {
  return fetchApi<Estadisticas>(`/historial/${aulaId}/estadisticas`);
}