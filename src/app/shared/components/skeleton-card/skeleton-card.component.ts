import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-chips">
          <div class="skeleton-chip"></div>
          <div class="skeleton-chip"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: white;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }
    
    .skeleton-header {
      padding: 16px;
    }
    
    .skeleton-title {
      height: 28px;
      width: 60%;
      background: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;
      animation: pulse 1.5s infinite;
    }
    
    .skeleton-subtitle {
      height: 20px;
      width: 40%;
      background: #f0f0f0;
      border-radius: 4px;
      animation: pulse 1.5s infinite;
    }
    
    .skeleton-content {
      padding: 16px;
    }
    
    .skeleton-chips {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    
    .skeleton-chip {
      height: 24px;
      width: 80px;
      background: #f0f0f0;
      border-radius: 16px;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `]
})
export class SkeletonCardComponent {}
