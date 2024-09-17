import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyPaymentComponent } from './third-party-payment.component';

describe('ThirdPartyPaymentComponent', () => {
  let component: ThirdPartyPaymentComponent;
  let fixture: ComponentFixture<ThirdPartyPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
