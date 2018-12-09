import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetStepperComponent } from './dataset-stepper.component';

describe('DatasetStepperComponent', () => {
  let component: DatasetStepperComponent;
  let fixture: ComponentFixture<DatasetStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
