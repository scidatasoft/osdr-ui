import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EntityCountsComponent } from './entity-counts.component';

describe('EntityCountsComponent', () => {
  let component: EntityCountsComponent;
  let fixture: ComponentFixture<EntityCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityCountsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
