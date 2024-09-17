import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSalesBillentryGSTComponent } from './multiple-sales-billentry-gst.component';

describe('MultipleSalesBillentryGSTComponent', () => {
  let component: MultipleSalesBillentryGSTComponent;
  let fixture: ComponentFixture<MultipleSalesBillentryGSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleSalesBillentryGSTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleSalesBillentryGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
