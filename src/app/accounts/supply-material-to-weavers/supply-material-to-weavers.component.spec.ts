import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyMaterialToWeaversComponent } from './supply-material-to-weavers.component';

describe('SupplyMaterialToWeaversComponent', () => {
  let component: SupplyMaterialToWeaversComponent;
  let fixture: ComponentFixture<SupplyMaterialToWeaversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyMaterialToWeaversComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplyMaterialToWeaversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
