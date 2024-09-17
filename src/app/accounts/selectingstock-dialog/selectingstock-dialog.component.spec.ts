import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectingstockDialogComponent } from './selectingstock-dialog.component';

describe('SelectingstockDialogComponent', () => {
  let component: SelectingstockDialogComponent;
  let fixture: ComponentFixture<SelectingstockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectingstockDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectingstockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
