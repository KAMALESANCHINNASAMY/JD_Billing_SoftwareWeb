import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSalesBillentryComponent } from './multiple-sales-billentry.component';

describe('MultipleSalesBillentryComponent', () => {
  let component: MultipleSalesBillentryComponent;
  let fixture: ComponentFixture<MultipleSalesBillentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleSalesBillentryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleSalesBillentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
