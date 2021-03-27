import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStoreComponent } from './dialog-store.component';

describe('DialogStoreComponent', () => {
  let component: DialogStoreComponent;
  let fixture: ComponentFixture<DialogStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
