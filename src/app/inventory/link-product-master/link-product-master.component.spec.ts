import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProductMasterComponent } from './link-product-master.component';

describe('LinkProductMasterComponent', () => {
  let component: LinkProductMasterComponent;
  let fixture: ComponentFixture<LinkProductMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkProductMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
