import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private get storage(): any | null {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    return g && g.localStorage ? g.localStorage : null;
  }

  private _isAuthed$ = new BehaviorSubject<boolean>(!!this.storage?.getItem('access_token'));
  isAuthed$ = this._isAuthed$.asObservable();

  // PUBLIC_INTERFACE
  /** Sets access token and emits auth state */
  setToken(token: string) {
    this.storage?.setItem('access_token', token);
    this._isAuthed$.next(true);
  }

  // PUBLIC_INTERFACE
  /** Clears token and emits auth state */
  logout() {
    this.storage?.removeItem('access_token');
    this._isAuthed$.next(false);
  }

  // PUBLIC_INTERFACE
  /** Returns whether user is currently authenticated */
  isAuthenticated(): boolean {
    return !!this.storage?.getItem('access_token');
  }
}
