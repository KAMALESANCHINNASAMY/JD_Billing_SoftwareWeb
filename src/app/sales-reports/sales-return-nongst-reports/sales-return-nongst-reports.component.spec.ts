import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnNongstReportsComponent } from './sales-return-nongst-reports.component';

describe('SalesReturnNongstReportsComponent', () => {
  let component: SalesReturnNongstReportsComponent;
  let fixture: ComponentFixture<SalesReturnNongstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesReturnNongstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReturnNongstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
