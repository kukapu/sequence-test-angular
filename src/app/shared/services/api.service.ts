import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost:3000';

  constructor() { }

  /**
   * Realiza una petición GET a la API
   * @param endpoint Endpoint de la API
   * @param queryParams Parámetros de consulta opcionales
   * @returns Promise con la respuesta de la API
   */
  async get<T>(endpoint: string, queryParams?: Record<string, string | number>): Promise<T> {
    try {
      let url = `${this.BASE_URL}/${endpoint}`;
      
      if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          params.append(key, value.toString());
        });
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST a la API
   * @param endpoint Endpoint de la API
   * @param data Datos a enviar
   * @returns Promise con la respuesta de la API
   */
  async post<T, R = T>(endpoint: string, data: T): Promise<R> {
    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json() as Promise<R>;
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT a la API
   * @param endpoint Endpoint de la API
   * @param data Datos a enviar
   * @returns Promise con la respuesta de la API
   */
  async put<T, R = T>(endpoint: string, data: T): Promise<R> {
    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json() as Promise<R>;
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE a la API
   * @param endpoint Endpoint de la API
   * @returns Promise con la respuesta de la API
   */
  async delete<T = boolean>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Intentar parsear la respuesta como JSON, si falla devolver true
      try {
        return await response.json() as T;
      } catch {
        return true as unknown as T;
      }
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}
