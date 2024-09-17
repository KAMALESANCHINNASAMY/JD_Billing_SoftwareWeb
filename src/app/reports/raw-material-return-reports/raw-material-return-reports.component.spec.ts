import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialReturnReportsComponent } from './raw-material-return-reports.component';

describe('RawMaterialReturnReportsComponent', () => {
  let component: RawMaterialReturnReportsComponent;
  let fixture: ComponentFixture<RawMaterialReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawMaterialReturnReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
