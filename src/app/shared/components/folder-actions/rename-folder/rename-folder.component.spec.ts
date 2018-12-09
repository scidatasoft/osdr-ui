import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFolderComponent } from './rename-folder.component';

describe('RenameFolderComponent', () => {
  let component: RenameFolderComponent;
  let fixture: ComponentFixture<RenameFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
