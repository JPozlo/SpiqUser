import { TestBed } from '@angular/core/testing';

import { AnalysisCrashService } from './analysis-crash.service';

describe('AnalysisCrashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalysisCrashService = TestBed.get(AnalysisCrashService);
    expect(service).toBeTruthy();
  });
});
