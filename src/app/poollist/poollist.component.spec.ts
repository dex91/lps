import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoollistComponent } from './poollist.component';

describe('PoollistComponent', () => {
  let component: PoollistComponent;
  let fixture: ComponentFixture<PoollistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoollistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoollistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
