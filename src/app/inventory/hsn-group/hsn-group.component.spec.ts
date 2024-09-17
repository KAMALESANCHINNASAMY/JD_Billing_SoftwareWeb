import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnGroupComponent } from './hsn-group.component';

describe('HsnGroupComponent', () => {
  let component: HsnGroupComponent;
  let fixture: ComponentFixture<HsnGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HsnGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HsnGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
