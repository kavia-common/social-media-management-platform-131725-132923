import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { PostedItem } from '../../core/models';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" style="padding:1rem;">
      <div class="section-title" style="margin-bottom:.5rem;">Posted Content</div>
      <table class="table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Content</th>
            <th>Posted At</th>
            <th>Metrics</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of posted">
            <td><span class="badge">{{p.platform}}</span></td>
            <td>{{p.content}}</td>
            <td>{{p.postedAt | date:'medium'}}</td>
            <td>
              <span *ngIf="p.metrics; else nm">
                <span class="badge" *ngFor="let k of metricKeys(p)">
                  {{k}}: {{p.metrics ? p.metrics[k] : ''}}
                </span>
              </span>
              <ng-template #nm><span class="badge">-</span></ng-template>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="posted.length === 0" style="color:var(--text-muted);padding:.5rem;">No posts found.</div>
    </div>
  `
})
export class ContentComponent implements OnInit {
  private api = inject(ApiService);
  posted: PostedItem[] = [];

  ngOnInit(): void {
    this.api.listPosted().subscribe({ next: r => this.posted = r.data || [], error: () => this.posted = [] });
  }

  metricKeys(p: PostedItem) {
    return p.metrics ? Object.keys(p.metrics) : [];
  }
}
