import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySupplyReturnComponent } from './third-party-supply-return.component';

describe('ThirdPartySupplyReturnComponent', () => {
  let component: ThirdPartySupplyReturnComponent;
  let fixture: ComponentFixture<ThirdPartySupplyReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartySupplyReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartySupplyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
