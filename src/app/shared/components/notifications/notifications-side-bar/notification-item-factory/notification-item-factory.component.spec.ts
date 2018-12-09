import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationItemFactoryComponent } from './notification-item-factory.component';

describe('NotificationItemFactoryComponent', () => {
  let component: NotificationItemFactoryComponent;
  let fixture: ComponentFixture<NotificationItemFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationItemFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
