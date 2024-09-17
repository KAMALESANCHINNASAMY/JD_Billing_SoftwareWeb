import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySareesgstPurchaseComponent } from './third-party-sareesgst-purchase.component';

describe('ThirdPartySareesgstPurchaseComponent', () => {
  let component: ThirdPartySareesgstPurchaseComponent;
  let fixture: ComponentFixture<ThirdPartySareesgstPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartySareesgstPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartySareesgstPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
