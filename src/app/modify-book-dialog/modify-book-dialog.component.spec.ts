import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBookDialogComponent } from './modify-book-dialog.component';

describe('ModifyBookDialogComponent', () => {
  let component: ModifyBookDialogComponent;
  let fixture: ComponentFixture<ModifyBookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyBookDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
