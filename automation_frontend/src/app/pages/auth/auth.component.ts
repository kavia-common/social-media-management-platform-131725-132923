import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="display:grid;place-items:center;min-height:100vh;background:var(--surface);">
      <div class="card" style="width:min(420px, 92vw); padding:1.25rem;">
        <div style="display:flex;gap:.75rem;align-items:center;margin-bottom:1rem;">
          <div style="width:38px;height:38px;border-radius:9px;background:var(--color-primary);"></div>
          <div>
            <div style="font-weight:800;">Social Automator</div>
            <div style="color:var(--text-muted);font-size:.9rem;">Sign in or create an account</div>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #f="ngForm" class="grid" style="gap:.75rem;">
          <input class="input" name="name" [(ngModel)]="name" placeholder="Name (for registration)" />
          <input required class="input" name="email" [(ngModel)]="email" type="email" placeholder="Email" />
          <input required class="input" name="password" [(ngModel)]="password" type="password" placeholder="Password" />

          <div style="display:flex;gap:.5rem;align-items:center;justify-content:space-between;margin-top:.25rem;">
            <button class="btn primary" type="submit">{{mode === 'login' ? 'Sign in' : 'Create account'}}</button>
            <button class="btn" type="button" (click)="toggleMode()">
              {{mode === 'login' ? 'Need an account?' : 'Have an account?'}}
            </button>
          </div>
          <div *ngIf="error" style="color:#b91c1c;font-size:.9rem;">{{error}}</div>
        </form>
      </div>
    </div>
  `
})
export class AuthComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mode: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';
  error = '';

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = '';
  }

  onSubmit() {
    this.error = '';
    if (this.mode === 'login') {
      this.api.login(this.email, this.password).subscribe({
        next: (res) => {
          this.auth.setToken(res.data.accessToken);
          this.router.navigate(['/']);
        },
        error: (err) => this.error = err.message
      });
    } else {
      this.api.register(this.name, this.email, this.password).subscribe({
        next: () => {
          // After registration, auto login
          this.api.login(this.email, this.password).subscribe({
            next: (res) => {
              this.auth.setToken(res.data.accessToken);
              this.router.navigate(['/']);
            },
            error: (err) => this.error = err.message
          });
        },
        error: (err) => this.error = err.message
      });
    }
  }
}
