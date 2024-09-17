import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyMasterComponent } from './third-party-master.component';

describe('ThirdPartyMasterComponent', () => {
  let component: ThirdPartyMasterComponent;
  let fixture: ComponentFixture<ThirdPartyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
