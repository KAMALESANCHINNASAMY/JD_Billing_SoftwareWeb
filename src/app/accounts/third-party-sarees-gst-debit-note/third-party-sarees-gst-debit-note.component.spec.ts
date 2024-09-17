import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySareesGstDebitNoteComponent } from './third-party-sarees-gst-debit-note.component';

describe('ThirdPartySareesGstDebitNoteComponent', () => {
  let component: ThirdPartySareesGstDebitNoteComponent;
  let fixture: ComponentFixture<ThirdPartySareesGstDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartySareesGstDebitNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartySareesGstDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
