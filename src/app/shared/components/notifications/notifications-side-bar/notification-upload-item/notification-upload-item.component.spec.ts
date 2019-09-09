import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NotificationUploadItemComponent } from './notification-upload-item.component';

describe('NotificationUploadItemComponent', () => {
  let component: NotificationUploadItemComponent;
  let fixture: ComponentFixture<NotificationUploadItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationUploadItemComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUploadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
