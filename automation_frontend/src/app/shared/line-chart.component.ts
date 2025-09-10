import { Component, Input, OnChanges } from '@angular/core';
import { AnalyticsSeries } from '../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" style="padding:1rem;">
      <div class="section-title" style="margin-bottom:.5rem;">{{title}}</div>
      <svg [attr.width]="width" [attr.height]="height" role="img" aria-label="Chart">
        <g *ngFor="let s of series; let i = index">
          <polyline
            [attr.points]="toPoints(s)"
            [attr.fill]="'none'"
            [attr.stroke]="colors[i % colors.length]"
            stroke-width="2"
          />
        </g>
        <!-- Axes can be enhanced if needed -->
      </svg>
    </div>
  `
})
export class LineChartComponent implements OnChanges {
  @Input() title = 'Trend';
  @Input() series: AnalyticsSeries[] = [];
  @Input() width = 600;
  @Input() height = 220;

  colors = ['#1da1f2', '#4267b2', '#e1306c', '#10b981', '#f59e0b'];

  private xValues: (string|number)[] = [];
  private maxY = 1;

  ngOnChanges(): void {
    const xSet = new Set<string|number>();
    let maxY = 0;
    this.series.forEach(s => {
      s.points.forEach(p => {
        xSet.add(p.x);
        if (p.y > maxY) maxY = p.y;
      });
    });
    this.xValues = Array.from(xSet);
    this.maxY = Math.max(1, maxY);
  }

  toPoints(s: AnalyticsSeries): string {
    const pad = 24;
    const innerW = this.width - pad * 2;
    const innerH = this.height - pad * 2;

    const xIndex = (x: string|number) => this.xValues.findIndex(v => v === x);
    const xScale = (i: number) => pad + (innerW * (this.xValues.length <= 1 ? 0 : i / (this.xValues.length - 1)));
    const yScale = (y: number) => pad + innerH - (innerH * (y / this.maxY));

    return s.points
      .map(p => `${xScale(xIndex(p.x))},${yScale(p.y)}`)
      .join(' ');
  }
}
