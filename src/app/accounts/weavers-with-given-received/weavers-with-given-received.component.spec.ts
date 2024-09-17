import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaversWithGivenReceivedComponent } from './weavers-with-given-received.component';

describe('WeaversWithGivenReceivedComponent', () => {
  let component: WeaversWithGivenReceivedComponent;
  let fixture: ComponentFixture<WeaversWithGivenReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaversWithGivenReceivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaversWithGivenReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
