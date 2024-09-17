import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPrintComponent } from './address-print.component';

describe('AddressPrintComponent', () => {
  let component: AddressPrintComponent;
  let fixture: ComponentFixture<AddressPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
