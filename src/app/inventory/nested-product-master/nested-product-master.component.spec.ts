import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedProductMasterComponent } from './nested-product-master.component';

describe('NestedProductMasterComponent', () => {
  let component: NestedProductMasterComponent;
  let fixture: ComponentFixture<NestedProductMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedProductMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NestedProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
