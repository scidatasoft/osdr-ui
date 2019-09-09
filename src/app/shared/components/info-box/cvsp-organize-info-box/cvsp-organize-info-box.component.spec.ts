import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CvspOrganizeInfoBoxComponent } from './cvsp-organize-info-box.component';

describe('CvspOrganizeInfoBoxComponent', () => {
  let component: CvspOrganizeInfoBoxComponent;
  let fixture: ComponentFixture<CvspOrganizeInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvspOrganizeInfoBoxComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvspOrganizeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
