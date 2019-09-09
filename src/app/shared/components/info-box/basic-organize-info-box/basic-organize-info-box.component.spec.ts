import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import {BasicOrganizeInfoBoxComponent} from './basic-organize-info-box.component';

describe('BasicInputComponent', () => {
  let component: BasicOrganizeInfoBoxComponent;
  let fixture: ComponentFixture<BasicOrganizeInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicOrganizeInfoBoxComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicOrganizeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
