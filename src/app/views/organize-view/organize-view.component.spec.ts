import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { OrganizeViewComponent } from './organize-view.component';

describe('OrganizeViewComponent', () => {
  let component: OrganizeViewComponent;
  let fixture: ComponentFixture<OrganizeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
