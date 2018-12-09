import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWebPageComponent } from './import-web-page.component';

describe('ImportWebPageComponent', () => {
  let component: ImportWebPageComponent;
  let fixture: ComponentFixture<ImportWebPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportWebPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWebPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
