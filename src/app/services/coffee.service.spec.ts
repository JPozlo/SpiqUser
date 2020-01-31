import { TestBed } from '@angular/core/testing';

import { CoffeeService } from './coffee.service';

describe('CoffeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoffeeService = TestBed.get(CoffeeService);
    expect(service).toBeTruthy();
  });
});
