import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySareesComponent } from './third-party-sarees.component';

describe('ThirdPartySareesComponent', () => {
  let component: ThirdPartySareesComponent;
  let fixture: ComponentFixture<ThirdPartySareesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartySareesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartySareesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
