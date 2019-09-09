import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PropertiesInfoBoxComponent } from './properties-info-box.component';

describe('PropertiesInfoBoxComponent', () => {
  let component: PropertiesInfoBoxComponent;
  let fixture: ComponentFixture<PropertiesInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesInfoBoxComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
