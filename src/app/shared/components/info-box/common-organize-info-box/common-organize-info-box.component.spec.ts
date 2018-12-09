import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CommonOrganizeInfoBoxComponent} from './common-organize-info-box.component';


describe('CommonInputComponent', () => {
  let component: CommonOrganizeInfoBoxComponent;
  let fixture: ComponentFixture<CommonOrganizeInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonOrganizeInfoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonOrganizeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
