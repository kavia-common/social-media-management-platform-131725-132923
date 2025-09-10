import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ScheduledPost, SocialAccount } from '../../core/models';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid" style="gap:1rem;">
      <div class="card" style="padding:1rem;">
        <div class="section-title" style="margin-bottom:.5rem;">Create Scheduled Post</div>
        <form class="grid" style="gap:.6rem;" (ngSubmit)="create()">
          <textarea class="input" [(ngModel)]="form.content" name="content" placeholder="Write content..." rows="3"></textarea>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:.6rem;">
            <select class="input" [(ngModel)]="form.platform" name="platform">
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
            </select>
            <input class="input" type="datetime-local" [(ngModel)]="form.scheduledAt" name="scheduledAt" />
            <select multiple class="input" [(ngModel)]="form.targetAccounts" name="targetAccounts">
              <option *ngFor="let acc of accounts" [value]="acc.id">{{acc.platform}} - {{acc.handle}}</option>
            </select>
          </div>
          <div style="display:flex;gap:.5rem;justify-content:flex-end;">
            <button class="btn" type="reset" (click)="reset()">Reset</button>
            <button class="btn primary" type="submit">Schedule</button>
          </div>
        </form>
      </div>

      <div class="card" style="padding:1rem;">
        <div class="section-title" style="margin-bottom:.5rem;">Scheduled Posts</div>
        <div class="grid" style="gap:.5rem;">
          <div class="card" style="padding:.75rem;" *ngFor="let p of scheduled">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:.5rem;flex:1;">
                <span class="badge">{{p.platform}}</span>
                <div style="font-weight:600;">{{p.content}}</div>
              </div>
              <div class="badge">{{ p.scheduledAt | date:'medium' }}</div>
              <div class="badge">{{ p.status }}</div>
              <div style="display:flex;gap:.4rem;">
                <button class="btn" (click)="cancel(p)">Cancel</button>
              </div>
            </div>
          </div>
          <div *ngIf="scheduled.length === 0" style="color:var(--text-muted);">No scheduled posts.</div>
        </div>
      </div>
    </div>
  `
})
export class ScheduleComponent implements OnInit {
  private api = inject(ApiService);
  scheduled: ScheduledPost[] = [];
  accounts: SocialAccount[] = [];

  form: Partial<ScheduledPost> = {
    content: '',
    platform: 'twitter' as any,
    scheduledAt: '',
    targetAccounts: []
  };

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.listScheduled().subscribe({ next: r => this.scheduled = r.data || [], error: () => this.scheduled = [] });
    this.api.listSocialAccounts().subscribe({ next: r => this.accounts = r.data || [], error: () => this.accounts = [] });
  }

  reset() {
    this.form = { content: '', platform: 'twitter' as any, scheduledAt: '', targetAccounts: [] };
  }

  create() {
    if (!this.form.content || !this.form.scheduledAt) return;
    this.api.schedulePost(this.form).subscribe({
      next: () => { this.reset(); this.load(); },
      error: () => {}
    });
  }

  cancel(p: ScheduledPost) {
    this.api.cancelScheduled(p.id).subscribe({ next: () => this.load() });
  }
}
