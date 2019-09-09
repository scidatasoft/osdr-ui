import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MicroscopyViewComponent } from './microscopy-view.component';

describe('MicroscopyViewComponent', () => {
  let component: MicroscopyViewComponent;
  let fixture: ComponentFixture<MicroscopyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroscopyViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroscopyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
