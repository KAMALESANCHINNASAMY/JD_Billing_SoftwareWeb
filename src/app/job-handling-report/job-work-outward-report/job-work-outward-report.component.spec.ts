import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkOutwardReportComponent } from './job-work-outward-report.component';

describe('JobWorkOutwardReportComponent', () => {
  let component: JobWorkOutwardReportComponent;
  let fixture: ComponentFixture<JobWorkOutwardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWorkOutwardReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobWorkOutwardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
