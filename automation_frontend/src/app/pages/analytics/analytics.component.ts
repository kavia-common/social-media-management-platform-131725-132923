import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AnalyticsKPI, AnalyticsSeries } from '../../core/models';
import { LineChartComponent } from '../../shared/line-chart.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, LineChartComponent],
  template: `
    <div class="grid" style="gap:1rem;">
      <div class="grid" style="grid-template-columns: repeat(4, minmax(0,1fr)); gap:1rem;">
        <div class="card" *ngFor="let k of kpis" style="padding:1rem;">
          <div class="kpi">
            <div class="label">{{k.label}}</div>
            <div class="value">{{k.value | number}}</div>
            <div *ngIf="k.delta !== undefined" class="badge" [style.color]="k.delta! >= 0 ? '#16a34a' : '#b91c1c'">
              {{k.delta! >= 0 ? '▲' : '▼'}} {{ (k.delta || 0) | number:'1.0-2' }}%
            </div>
          </div>
        </div>
      </div>
      <app-line-chart [title]="'Overview'" [series]="series" [width]="900"></app-line-chart>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  private api = inject(ApiService);
  kpis: AnalyticsKPI[] = [];
  series: AnalyticsSeries[] = [];

  ngOnInit(): void {
    this.api.getKpis().subscribe({ next: r => this.kpis = r.data || [], error: () => this.kpis = [] });
    this.api.getSeries().subscribe({ next: r => this.series = r.data || [], error: () => this.series = [] });
  }
}
