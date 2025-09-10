import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ApiResponse, AuthToken, User, SocialAccount, ScheduledPost, PostedItem,
  AnalyticsKPI, AnalyticsSeries, AutomationRule, UUID
} from './models';

/**
 * PUBLIC_INTERFACE
 * ApiService provides typed methods to interact with automation_backend REST API.
 * It reads the base URL from environment.API_BASE_URL and attaches Authorization headers when available.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.API_BASE_URL;

  private get headers(): HttpHeaders {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    const ls: any = g && g.localStorage ? g.localStorage : undefined;
    const token = ls ? ls.getItem('access_token') : null;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // Auth
  // PUBLIC_INTERFACE
  login(email: string, password: string): Observable<ApiResponse<AuthToken>> {
    return this.http.post<ApiResponse<AuthToken>>(
      `${this.base}/auth/login`, { email, password }, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  register(name: string, email: string, password: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.base}/auth/register`, { name, email, password }, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  me(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/auth/me`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // Social accounts
  // PUBLIC_INTERFACE
  listSocialAccounts(): Observable<ApiResponse<SocialAccount[]>> {
    return this.http.get<ApiResponse<SocialAccount[]>>(`${this.base}/social/accounts`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  connectSocialAccount(platform: string): Observable<ApiResponse<{ authUrl: string }>> {
    return this.http.post<ApiResponse<{ authUrl: string }>>(
      `${this.base}/social/connect`, { platform }, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  disconnectSocialAccount(accountId: UUID): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.base}/social/accounts/${accountId}`, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // Scheduler
  // PUBLIC_INTERFACE
  schedulePost(payload: Partial<ScheduledPost>): Observable<ApiResponse<ScheduledPost>> {
    return this.http.post<ApiResponse<ScheduledPost>>(
      `${this.base}/schedule`, payload, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  listScheduled(): Observable<ApiResponse<ScheduledPost[]>> {
    return this.http.get<ApiResponse<ScheduledPost[]>>(`${this.base}/schedule`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  updateScheduled(id: UUID, patch: Partial<ScheduledPost>): Observable<ApiResponse<ScheduledPost>> {
    return this.http.patch<ApiResponse<ScheduledPost>>(
      `${this.base}/schedule/${id}`, patch, { headers: this.headers }
    ).pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  cancelScheduled(id: UUID): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/schedule/${id}`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // Posted content
  // PUBLIC_INTERFACE
  listPosted(): Observable<ApiResponse<PostedItem[]>> {
    return this.http.get<ApiResponse<PostedItem[]>>(`${this.base}/posts`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // Analytics
  // PUBLIC_INTERFACE
  getKpis(): Observable<ApiResponse<AnalyticsKPI[]>> {
    return this.http.get<ApiResponse<AnalyticsKPI[]>>(`${this.base}/analytics/kpis`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  getSeries(): Observable<ApiResponse<AnalyticsSeries[]>> {
    return this.http.get<ApiResponse<AnalyticsSeries[]>>(`${this.base}/analytics/series`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // Automation rules
  // PUBLIC_INTERFACE
  listRules(): Observable<ApiResponse<AutomationRule[]>> {
    return this.http.get<ApiResponse<AutomationRule[]>>(`${this.base}/rules`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  createRule(rule: Partial<AutomationRule>): Observable<ApiResponse<AutomationRule>> {
    return this.http.post<ApiResponse<AutomationRule>>(`${this.base}/rules`, rule, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  updateRule(id: UUID, patch: Partial<AutomationRule>): Observable<ApiResponse<AutomationRule>> {
    return this.http.patch<ApiResponse<AutomationRule>>(`${this.base}/rules/${id}`, patch, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  // PUBLIC_INTERFACE
  deleteRule(id: UUID): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/rules/${id}`, { headers: this.headers })
      .pipe(catchError(this.handle));
  }

  private handle(error: HttpErrorResponse) {
    const message = (error.error && (error.error.message || error.error.detail)) || error.message || 'Unknown error';
    return throwError(() => new Error(message));
  }
}
