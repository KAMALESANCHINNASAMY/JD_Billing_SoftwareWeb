import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySareesDebitNoteComponent } from './third-party-sarees-debit-note.component';

describe('ThirdPartySareesDebitNoteComponent', () => {
  let component: ThirdPartySareesDebitNoteComponent;
  let fixture: ComponentFixture<ThirdPartySareesDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartySareesDebitNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartySareesDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
