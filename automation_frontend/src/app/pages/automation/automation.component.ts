import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AutomationRule } from '../../core/models';

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid" style="gap:1rem;">
      <div class="card" style="padding:1rem;">
        <div class="section-title" style="margin-bottom:.5rem;">Create Rule</div>
        <form class="grid" style="gap:.6rem;" (ngSubmit)="create()">
          <input class="input" name="name" [(ngModel)]="form.name" placeholder="Rule name"/>
          <input class="input" name="description" [(ngModel)]="form.description" placeholder="Description"/>

          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:.6rem;">
            <select class="input" name="triggerType" [(ngModel)]="triggerType" (ngModelChange)="onTriggerTypeChange($event)">
              <option value="time">Time</option>
              <option value="event">Event</option>
              <option value="metric">Metric</option>
            </select>
            <input class="input" name="cron" [(ngModel)]="triggerCron" (ngModelChange)="form.trigger!.cron = $event" placeholder="Cron (for time) e.g. 0 9 * * *"/>
            <input class="input" name="eventName" [(ngModel)]="triggerEventName" (ngModelChange)="form.trigger!.eventName = $event" placeholder="Event name"/>
            <input class="input" name="metric" [(ngModel)]="triggerMetric" (ngModelChange)="form.trigger!.metric = $event" placeholder="Metric name"/>
            <select class="input" name="condition" [(ngModel)]="triggerCondition" (ngModelChange)="form.trigger!.condition = $event">
              <option value="">Condition</option>
              <option value="gt">gt</option>
              <option value="gte">gte</option>
              <option value="eq">eq</option>
              <option value="lte">lte</option>
              <option value="lt">lt</option>
            </select>
            <input class="input" type="number" name="threshold" [(ngModel)]="triggerThreshold" (ngModelChange)="form.trigger!.threshold = $any($event)" placeholder="Threshold"/>
          </div>

          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:.6rem;">
            <select class="input" name="actionType" [(ngModel)]="actionType" (ngModelChange)="form.action!.type = $event">
              <option value="post">Post</option>
              <option value="reschedule">Reschedule</option>
              <option value="notify">Notify</option>
            </select>
            <input class="input" name="templateId" [(ngModel)]="actionTemplateId" (ngModelChange)="form.action!.templateId = $event" placeholder="Template ID"/>
            <input class="input" type="number" name="delayMinutes" [(ngModel)]="actionDelayMinutes" (ngModelChange)="form.action!.delayMinutes = $any($event)" placeholder="Delay minutes"/>
          </div>

          <div style="display:flex;gap:.5rem;justify-content:flex-end;">
            <button class="btn" type="reset" (click)="reset()">Reset</button>
            <button class="btn primary" type="submit">Create</button>
          </div>
        </form>
      </div>

      <div class="card" style="padding:1rem;">
        <div class="section-title" style="margin-bottom:.5rem;">Rules</div>
        <div class="grid" style="gap:.6rem;">
          <div class="card" style="padding:.75rem;" *ngFor="let r of rules">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
              <div style="display:flex;flex-direction:column;gap:.25rem;">
                <div style="font-weight:700;">{{r.name}}</div>
                <div style="color:var(--text-muted); font-size:.92rem;">{{r.description}}</div>
                <div class="badge">Trigger: {{r.trigger.type}}</div>
                <div class="badge">Action: {{r.action.type}}</div>
              </div>
              <div style="display:flex;gap:.4rem;align-items:center;">
                <label class="badge">
                  <input type="checkbox" [checked]="r.active" (change)="toggle(r)" style="margin-right:.4rem;"> Active
                </label>
                <button class="btn" (click)="remove(r)">Delete</button>
              </div>
            </div>
          </div>
          <div *ngIf="rules.length === 0" style="color:var(--text-muted);">No rules defined.</div>
        </div>
      </div>
    </div>
  `
})
export class AutomationComponent implements OnInit {
  private api = inject(ApiService);
  rules: AutomationRule[] = [];

  form: Partial<AutomationRule> = {
    name: '',
    description: '',
    active: true,
    trigger: { type: 'time', cron: '0 9 * * *', eventName: '', metric: '', condition: undefined, threshold: undefined } as any,
    action: { type: 'post', templateId: '', delayMinutes: undefined } as any
  };

  // Local fields to bind safely
  triggerType: any = this.form.trigger!.type;
  triggerCron: any = this.form.trigger!.cron;
  triggerEventName: any = this.form.trigger!.eventName;
  triggerMetric: any = this.form.trigger!.metric;
  triggerCondition: any = this.form.trigger!.condition || '';
  triggerThreshold: any = this.form.trigger!.threshold;

  actionType: any = this.form.action!.type;
  actionTemplateId: any = this.form.action!.templateId;
  actionDelayMinutes: any = this.form.action!.delayMinutes;

  ngOnInit(): void {
    this.load();
  }

  onTriggerTypeChange(val: any) {
    this.form.trigger!.type = val;
    this.triggerType = val;
  }

  load() {
    this.api.listRules().subscribe({ next: r => this.rules = r.data || [], error: () => this.rules = [] });
  }

  reset() {
    this.form = {
      name: '',
      description: '',
      active: true,
      trigger: { type: 'time', cron: '', eventName: '', metric: '', condition: undefined, threshold: undefined } as any,
      action: { type: 'post', templateId: '', delayMinutes: undefined } as any
    };

    // reset local fields too
    this.triggerType = this.form.trigger!.type;
    this.triggerCron = this.form.trigger!.cron;
    this.triggerEventName = this.form.trigger!.eventName;
    this.triggerMetric = this.form.trigger!.metric;
    this.triggerCondition = this.form.trigger!.condition || '';
    this.triggerThreshold = this.form.trigger!.threshold;

    this.actionType = this.form.action!.type;
    this.actionTemplateId = this.form.action!.templateId;
    this.actionDelayMinutes = this.form.action!.delayMinutes;
  }

  create() {
    if (!this.form.name) return;
    this.api.createRule(this.form).subscribe({ next: () => { this.reset(); this.load(); } });
  }

  toggle(r: AutomationRule) {
    this.api.updateRule(r.id, { active: !r.active }).subscribe({ next: () => this.load() });
  }

  remove(r: AutomationRule) {
    this.api.deleteRule(r.id).subscribe({ next: () => this.load() });
  }
}
