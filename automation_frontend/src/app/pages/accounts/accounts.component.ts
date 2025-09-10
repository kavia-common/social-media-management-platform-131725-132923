import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { SocialAccount } from '../../core/models';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid" style="gap:1rem;">
      <div class="card" style="padding:1rem;">
        <div class="section-title" style="margin-bottom:.5rem;">Connected Accounts</div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: .75rem;">
          <div class="card" *ngFor="let acc of accounts" style="padding:.8rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:.6rem;">
                <span class="badge">{{acc.platform}}</span>
                <div style="font-weight:600;">{{acc.handle}}</div>
              </div>
              <div class="badge" [style.color]="acc.status === 'connected' ? '#16a34a' : '#b91c1c'">
                {{acc.status}}
              </div>
            </div>
            <div style="margin-top:.6rem; display:flex; gap:.5rem;">
              <button class="btn" (click)="disconnect(acc.id)">Disconnect</button>
            </div>
          </div>
        </div>
        <div *ngIf="accounts.length === 0" style="color:var(--text-muted);">No accounts connected yet.</div>
      </div>

      <div class="card" style="padding:1rem;">
        <div class="section-title">Connect New Account</div>
        <div style="display:flex;gap:.5rem;margin-top:.6rem;flex-wrap:wrap;">
          <button class="btn" (click)="connect('facebook')" style="border-color:#4267b2">Connect Facebook</button>
          <button class="btn" (click)="connect('instagram')" style="border-color:#e1306c">Connect Instagram</button>
          <button class="btn" (click)="connect('twitter')" style="border-color:#1da1f2">Connect Twitter</button>
          <button class="btn" (click)="connect('youtube')" style="border-color:#ff0000;color:#b91c1c">Connect YouTube</button>
        </div>
      </div>
    </div>
  `
})
export class AccountsComponent implements OnInit {
  private api = inject(ApiService);
  accounts: SocialAccount[] = [];

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.api.listSocialAccounts().subscribe({
      next: r => this.accounts = r.data || [],
      error: () => this.accounts = []
    });
  }

  connect(platform: string) {
    this.api.connectSocialAccount(platform).subscribe({
      next: r => {
        const url = r.data?.authUrl;
        if (url) {
          const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
          if (g && g.location) {
            g.location.href = url;
          }
        } else {
          this.reload();
        }
      },
      error: () => {}
    });
  }

  disconnect(id: string) {
    this.api.disconnectSocialAccount(id).subscribe({ next: () => this.reload() });
  }
}
