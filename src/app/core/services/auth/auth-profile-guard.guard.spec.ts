import { TestBed, async, inject } from '@angular/core/testing';

import { AuthProfileGuard } from './auth-profile-guard.guard';

describe('AuthProfileGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthProfileGuard]
    });
  });

  it('should ...', inject([AuthProfileGuard], (guard: AuthProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
