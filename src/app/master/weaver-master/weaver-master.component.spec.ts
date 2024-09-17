import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaverMasterComponent } from './weaver-master.component';

describe('WeaverMasterComponent', () => {
  let component: WeaverMasterComponent;
  let fixture: ComponentFixture<WeaverMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaverMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaverMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
