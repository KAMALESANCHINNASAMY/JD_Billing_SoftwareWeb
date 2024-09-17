import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiseCollectionComponent } from './datewise-collection.component';

describe('DatewiseCollectionComponent', () => {
  let component: DatewiseCollectionComponent;
  let fixture: ComponentFixture<DatewiseCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatewiseCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatewiseCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
