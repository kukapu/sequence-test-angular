import { Injectable, computed, signal } from '@angular/core';

export interface PaginationState<T> {
  items: T[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  error: Error | null;
}

@Injectable()
export class PaginationService<T> {
  private state = signal<PaginationState<T>>({
    items: [],
    page: 1,
    loading: false,
    hasMore: true,
    error: null
  });

  // Getters públicos como señales computadas
  items = computed(() => this.state().items);
  page = computed(() => this.state().page);
  loading = computed(() => this.state().loading);
  hasMore = computed(() => this.state().hasMore);
  error = computed(() => this.state().error);

  constructor() {}

  /**
   * Reinicia el estado de paginación
   */
  reset(): void {
    this.state.set({
      items: [],
      page: 1,
      loading: false,
      hasMore: true,
      error: null
    });
  }

  /**
   * Carga datos usando la función de carga proporcionada
   * @param loadFn Función que carga los datos
   * @param loadMore Indica si se deben cargar más datos o reiniciar
   * @param pageSize Tamaño de página
   */
  async loadData(
    loadFn: (page: number, pageSize: number) => Promise<T[]>,
    loadMore = false,
    pageSize = 20
  ): Promise<void> {
    // Si ya está cargando o no hay más datos, no hacer nada
    if (this.loading() || (!loadMore && !this.hasMore())) {
      return;
    }

    try {
      this.state.update(s => ({ ...s, loading: true }));

      // Si no es cargar más, reiniciar el estado
      if (!loadMore) {
        this.state.update(s => ({
          ...s,
          items: [],
          page: 1,
          hasMore: true
        }));
      }

      // Cargar datos
      const data = await loadFn(this.page(), pageSize);

      // Si no hay datos, no hay más páginas
      if (data.length === 0) {
        this.state.update(s => ({ ...s, hasMore: false }));
        return;
      }

      // Actualizar estado con los nuevos datos
      this.state.update(s => ({
        ...s,
        items: [...s.items, ...data],
        page: data.length === pageSize ? s.page + 1 : s.page,
        hasMore: data.length === pageSize
      }));
    } catch (error) {
      this.state.update(s => ({ 
        ...s, 
        error: error instanceof Error ? error : new Error(String(error))
      }));
      console.error('Error loading data:', error);
    } finally {
      this.state.update(s => ({ ...s, loading: false }));
    }
  }
}
