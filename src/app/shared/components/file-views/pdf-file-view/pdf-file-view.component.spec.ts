import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFileViewComponent } from './pdf-file-view.component';

describe('PdfFileViewComponent', () => {
  let component: PdfFileViewComponent;
  let fixture: ComponentFixture<PdfFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
