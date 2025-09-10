import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
        <div style="width:34px;height:34px;border-radius:8px;background:var(--color-primary);"></div>
        <div>
          <div style="font-weight:700;">Social Automator</div>
          <div style="font-size:.8rem;color:var(--text-muted);">Manage & Schedule</div>
        </div>
      </div>

      <ul class="nav">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">🏠 Dashboard</a></li>
        <li><a routerLink="/schedule" routerLinkActive="active">🗓️ Schedule</a></li>
        <li><a routerLink="/content" routerLinkActive="active">🧾 Content</a></li>
        <li><a routerLink="/analytics" routerLinkActive="active">📈 Analytics</a></li>
        <li><a routerLink="/automation" routerLinkActive="active">⚙️ Automation</a></li>
        <li><a routerLink="/accounts" routerLinkActive="active">🔗 Accounts</a></li>
      </ul>
    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;
}
