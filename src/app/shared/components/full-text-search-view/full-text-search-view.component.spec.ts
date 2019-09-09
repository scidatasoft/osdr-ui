import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FullTextSearchViewComponent } from './full-text-search-view.component';

describe('FullTextSearchViewComponent', () => {
  let component: FullTextSearchViewComponent;
  let fixture: ComponentFixture<FullTextSearchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullTextSearchViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTextSearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
