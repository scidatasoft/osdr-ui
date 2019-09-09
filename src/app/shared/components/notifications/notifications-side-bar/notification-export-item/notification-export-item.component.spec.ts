import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NotificationExportItemComponent } from './notification-export-item.component';

describe('NotificationExportItemComponent', () => {
  let component: NotificationExportItemComponent;
  let fixture: ComponentFixture<NotificationExportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationExportItemComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationExportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
