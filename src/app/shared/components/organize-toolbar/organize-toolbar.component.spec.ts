import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeToolbarComponent } from './organize-toolbar.component';

describe('OrganizeToolbarComponent', () => {
  let component: OrganizeToolbarComponent;
  let fixture: ComponentFixture<OrganizeToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
