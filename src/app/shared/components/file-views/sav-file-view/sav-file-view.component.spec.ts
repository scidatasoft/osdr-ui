import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SavFileViewComponent } from './sav-file-view.component';

describe('SavFileViewComponent', () => {
  let component: SavFileViewComponent;
  let fixture: ComponentFixture<SavFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavFileViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
