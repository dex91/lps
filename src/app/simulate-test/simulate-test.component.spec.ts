import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateTestComponent } from './simulate-test.component';

describe('SimulateTestComponent', () => {
  let component: SimulateTestComponent;
  let fixture: ComponentFixture<SimulateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
