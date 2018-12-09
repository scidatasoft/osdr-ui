import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CifPreviewComponent } from './cif-preview.component';

describe('CifPreviewComponent', () => {
  let component: CifPreviewComponent;
  let fixture: ComponentFixture<CifPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CifPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CifPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
