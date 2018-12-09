import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStructurePredictionComponent } from './single-structure-prediction.component';

describe('SingleStructurePredictionComponent', () => {
  let component: SingleStructurePredictionComponent;
  let fixture: ComponentFixture<SingleStructurePredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleStructurePredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleStructurePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
