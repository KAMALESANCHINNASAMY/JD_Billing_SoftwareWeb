import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierwiseReportsComponent } from './supplierwise-reports.component';

describe('SupplierwiseReportsComponent', () => {
  let component: SupplierwiseReportsComponent;
  let fixture: ComponentFixture<SupplierwiseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierwiseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierwiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
