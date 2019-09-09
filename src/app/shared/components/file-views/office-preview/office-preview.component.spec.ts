import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { OfficePreviewComponent } from './office-preview.component';

describe('OfficePreviewComponent', () => {
  let component: OfficePreviewComponent;
  let fixture: ComponentFixture<OfficePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficePreviewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
