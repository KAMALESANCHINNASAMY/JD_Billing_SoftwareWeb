import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseMasterComponent } from './expense-master.component';

describe('ExpenseMasterComponent', () => {
  let component: ExpenseMasterComponent;
  let fixture: ComponentFixture<ExpenseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
