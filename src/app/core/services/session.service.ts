import { Injectable } from '@angular/core';

export interface SessionData {
  token?: string;
  userName?: string;
  userId?: any;
  emailId?: string;
  userType?: any;
  pages?: any[];
  accessibleParts?: any;
  isFirstLogin?: boolean;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private static readonly AUTH_KEY = 'ls.authorizationData';

  /** Parsed session object, or null if absent/corrupt. */
  getSession(): SessionData | null {
    const raw = localStorage.getItem(SessionService.AUTH_KEY);
    if (!raw || raw === 'undefined' || raw === 'null') {
      return null;
    }
    try {
      return JSON.parse(raw) as SessionData;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  /** True only when a session exists AND its JWT has not expired. */
  isValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const exp = this.getTokenExpiryMs(token);
    // If we can't read an expiry, fall back to "present = valid" so we never
    // lock out users on a token format we didn't anticipate; the server still
    // rejects a bad token with 401.
    if (exp == null) {
      return true;
    }
    return Date.now() < exp;
  }

  /** True when a token exists but its expiry is in the past. */
  isExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const exp = this.getTokenExpiryMs(token);
    return exp != null && Date.now() >= exp;
  }

  /** Milliseconds until the JWT expires (negative if already expired), or null if unknown. */
  getMillisUntilExpiry(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const exp = this.getTokenExpiryMs(token);
    return exp == null ? null : exp - Date.now();
  }

  /** Replace only the token on the stored session, keeping the rest of the payload. */
  updateToken(token: string): void {
    const current = this.getSession();
    if (!current || !token) {
      return;
    }
    current.token = token;
    try {
      localStorage.setItem(SessionService.AUTH_KEY, JSON.stringify(current));
    } catch {}
  }

  clearSession(): void {
    localStorage.removeItem(SessionService.AUTH_KEY);
  }

  clear(): void {
    [
      SessionService.AUTH_KEY,
      'lsOffline.authorizationData',
      'token',
      'pages',
      'username',
      'password',
    ].forEach((k) => localStorage.removeItem(k));
  }

  /** Epoch milliseconds of the JWT `exp` claim, or null if unreadable. */
  private getTokenExpiryMs(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      // base64url -> base64, then pad to a multiple of 4 for atob().
      let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      b64 += '='.repeat((4 - (b64.length % 4)) % 4);
      const claims = JSON.parse(atob(b64));
      return typeof claims?.exp === 'number' ? claims.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
