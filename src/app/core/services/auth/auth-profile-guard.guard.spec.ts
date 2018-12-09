import { TestBed, async, inject } from '@angular/core/testing';

import { AuthProfileGuardGuard } from './auth-profile-guard.guard';

describe('AuthProfileGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthProfileGuardGuard]
    });
  });

  it('should ...', inject([AuthProfileGuardGuard], (guard: AuthProfileGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
