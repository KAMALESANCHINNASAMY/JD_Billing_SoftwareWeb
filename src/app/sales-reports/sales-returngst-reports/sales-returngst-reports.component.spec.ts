import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturngstReportsComponent } from './sales-returngst-reports.component';

describe('SalesReturngstReportsComponent', () => {
  let component: SalesReturngstReportsComponent;
  let fixture: ComponentFixture<SalesReturngstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesReturngstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReturngstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
