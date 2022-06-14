import { TestBed } from '@angular/core/testing';

import { TfWorkerServiceService } from './tf-worker-service.service';

describe('TfWorkerServiceService', () => {
  let service: TfWorkerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TfWorkerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
