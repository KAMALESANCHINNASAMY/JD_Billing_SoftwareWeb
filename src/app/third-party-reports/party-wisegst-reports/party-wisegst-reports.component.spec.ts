import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyWisegstReportsComponent } from './party-wisegst-reports.component';

describe('PartyWisegstReportsComponent', () => {
  let component: PartyWisegstReportsComponent;
  let fixture: ComponentFixture<PartyWisegstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyWisegstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartyWisegstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
