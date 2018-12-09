import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesComputationComponent } from './features-computation.component';

describe('FeaturesComputationComponent', () => {
  let component: FeaturesComputationComponent;
  let fixture: ComponentFixture<FeaturesComputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesComputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesComputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
