import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationProcessItemComponent } from './notification-process-item.component';

describe('NotificationProcessItemComponent', () => {
  let component: NotificationProcessItemComponent;
  let fixture: ComponentFixture<NotificationProcessItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationProcessItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationProcessItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
