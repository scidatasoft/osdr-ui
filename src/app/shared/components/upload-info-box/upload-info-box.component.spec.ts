import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadInfoBoxComponent } from './upload-info-box.component';

describe('UploadInfoBoxComponent', () => {
  let component: UploadInfoBoxComponent;
  let fixture: ComponentFixture<UploadInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadInfoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
