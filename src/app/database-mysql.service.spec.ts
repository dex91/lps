import { TestBed } from '@angular/core/testing';

import { DatabaseMysqlService } from './database-mysql.service';

describe('DatabaseMysqlService', () => {
  let service: DatabaseMysqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseMysqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
