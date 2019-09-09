import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SharedLinksComponent } from './shared-links.component';

describe('SharedLinksComponent', () => {
  let component: SharedLinksComponent;
  let fixture: ComponentFixture<SharedLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedLinksComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
