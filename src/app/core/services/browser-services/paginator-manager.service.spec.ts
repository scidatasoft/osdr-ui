import { TestBed, inject } from '@angular/core/testing';

import { PaginatorManagerService } from './paginator-manager.service';

describe('PaginatorManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginatorManagerService]
    });
  });

  it('should be created', inject([PaginatorManagerService], (service: PaginatorManagerService) => {
    expect(service).toBeTruthy();
  }));
});
