import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineLearningPredictComponent } from './machine-learning-predict.component';

describe('MachineLearningPredictComponent', () => {
  let component: MachineLearningPredictComponent;
  let fixture: ComponentFixture<MachineLearningPredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineLearningPredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLearningPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
