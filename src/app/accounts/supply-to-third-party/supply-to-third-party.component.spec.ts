import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyToThirdPartyComponent } from './supply-to-third-party.component';

describe('SupplyToThirdPartyComponent', () => {
  let component: SupplyToThirdPartyComponent;
  let fixture: ComponentFixture<SupplyToThirdPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyToThirdPartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplyToThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
