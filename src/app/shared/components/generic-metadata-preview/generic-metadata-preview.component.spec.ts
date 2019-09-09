import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { GenericMetadataPreviewComponent } from './generic-metadata-preview.component';

describe('GenericMetadataPreviewComponent', () => {
  let component: GenericMetadataPreviewComponent;
  let fixture: ComponentFixture<GenericMetadataPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMetadataPreviewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMetadataPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
