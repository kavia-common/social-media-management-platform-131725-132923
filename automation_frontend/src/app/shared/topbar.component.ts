import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="appbar" style="display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span class="section-title">Dashboard</span>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;">
        <a class="btn" routerLink="/accounts">Accounts</a>
        <button class="btn" (click)="onLogout()">Logout</button>
      </div>
    </header>
  `
})
export class TopbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
