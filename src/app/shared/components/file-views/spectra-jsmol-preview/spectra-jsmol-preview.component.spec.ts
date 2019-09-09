import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SpectraJsmolPreviewComponent } from './spectra-jsmol-preview.component';

describe('SpectraJsmolPreviewComponent', () => {
  let component: SpectraJsmolPreviewComponent;
  let fixture: ComponentFixture<SpectraJsmolPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpectraJsmolPreviewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectraJsmolPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
