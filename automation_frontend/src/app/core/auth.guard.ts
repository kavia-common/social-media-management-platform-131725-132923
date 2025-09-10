import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// PUBLIC_INTERFACE
/** Guard to protect authenticated routes. Redirects to /auth if not authenticated. */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/auth']);
  return false;
};
