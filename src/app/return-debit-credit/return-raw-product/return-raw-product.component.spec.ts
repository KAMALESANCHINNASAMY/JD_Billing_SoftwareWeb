import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRawProductComponent } from './return-raw-product.component';

describe('ReturnRawProductComponent', () => {
  let component: ReturnRawProductComponent;
  let fixture: ComponentFixture<ReturnRawProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnRawProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnRawProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
