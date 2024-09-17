import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SareeWiseGstReportsComponent } from './saree-wise-gst-reports.component';

describe('SareeWiseGstReportsComponent', () => {
  let component: SareeWiseGstReportsComponent;
  let fixture: ComponentFixture<SareeWiseGstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SareeWiseGstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SareeWiseGstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
