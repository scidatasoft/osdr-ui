import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchResponseComponent } from './switch-response.component';

describe('SwitchResponseComponent', () => {
  let component: SwitchResponseComponent;
  let fixture: ComponentFixture<SwitchResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
