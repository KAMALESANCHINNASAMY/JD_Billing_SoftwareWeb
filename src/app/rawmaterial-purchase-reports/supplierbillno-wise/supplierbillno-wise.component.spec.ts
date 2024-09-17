import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierbillnoWiseComponent } from './supplierbillno-wise.component';

describe('SupplierbillnoWiseComponent', () => {
  let component: SupplierbillnoWiseComponent;
  let fixture: ComponentFixture<SupplierbillnoWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierbillnoWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierbillnoWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
