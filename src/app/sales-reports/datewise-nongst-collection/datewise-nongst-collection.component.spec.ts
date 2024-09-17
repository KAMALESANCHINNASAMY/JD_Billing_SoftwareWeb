import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiseNongstCollectionComponent } from './datewise-nongst-collection.component';

describe('DatewiseNongstCollectionComponent', () => {
  let component: DatewiseNongstCollectionComponent;
  let fixture: ComponentFixture<DatewiseNongstCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatewiseNongstCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatewiseNongstCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
