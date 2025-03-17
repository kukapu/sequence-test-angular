import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() scrollThreshold = 150;
  @Input() scrollDebounceTime = 100;
  @Output() scrolledToBottom = new EventEmitter<void>();

  private scrollElement: HTMLElement;
  private scrollHandler: (() => void) | null = null;
  private scrollTimeout: any = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {
    this.scrollElement = this.el.nativeElement;
  }

  ngOnInit(): void {
    this.setupScrollHandler();
  }

  ngOnDestroy(): void {
    this.removeScrollHandler();
  }

  private setupScrollHandler(): void {
    // Ejecutar fuera de la zona de Angular para mejor rendimiento
    this.zone.runOutsideAngular(() => {
      this.scrollHandler = this.onScroll.bind(this);
      this.scrollElement.addEventListener('scroll', this.scrollHandler);
    });
  }

  private removeScrollHandler(): void {
    if (this.scrollHandler) {
      this.scrollElement.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
  }

  private onScroll(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Debounce para evitar múltiples llamadas
    this.scrollTimeout = setTimeout(() => {
      const { scrollTop, clientHeight, scrollHeight } = this.scrollElement;
      
      // Si estamos cerca del final, emitir el evento
      if (scrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
        // Volver a la zona de Angular para emitir el evento
        this.zone.run(() => {
          this.scrolledToBottom.emit();
        });
      }
    }, this.scrollDebounceTime);
  }
}
