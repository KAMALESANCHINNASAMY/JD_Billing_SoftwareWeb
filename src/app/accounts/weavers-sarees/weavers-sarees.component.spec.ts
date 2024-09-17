import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaversSareesComponent } from './weavers-sarees.component';

describe('WeaversSareesComponent', () => {
  let component: WeaversSareesComponent;
  let fixture: ComponentFixture<WeaversSareesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeaversSareesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaversSareesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
