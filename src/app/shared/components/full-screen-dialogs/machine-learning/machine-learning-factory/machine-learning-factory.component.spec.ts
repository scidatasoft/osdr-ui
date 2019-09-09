import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MachineLearningFactoryComponent } from './machine-learning-factory.component';

describe('MachineLearningFactoryComponent', () => {
  let component: MachineLearningFactoryComponent;
  let fixture: ComponentFixture<MachineLearningFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineLearningFactoryComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLearningFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
