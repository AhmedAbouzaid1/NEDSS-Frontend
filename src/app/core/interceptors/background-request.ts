import { HttpContext, HttpContextToken } from '@angular/common/http';

export const BACKGROUND_REQUEST = new HttpContextToken<boolean>(() => false);

export function backgroundRequestContext(): HttpContext {
  return new HttpContext().set(BACKGROUND_REQUEST, true);
}
