import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstSareeHistoryComponent } from './gst-saree-history.component';

describe('GstSareeHistoryComponent', () => {
  let component: GstSareeHistoryComponent;
  let fixture: ComponentFixture<GstSareeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GstSareeHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GstSareeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
