import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstMasterComponent } from './gst-master.component';

describe('GstMasterComponent', () => {
  let component: GstMasterComponent;
  let fixture: ComponentFixture<GstMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GstMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GstMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
