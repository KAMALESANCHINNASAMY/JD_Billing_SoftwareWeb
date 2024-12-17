import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkInwardReportComponent } from './job-work-inward-report.component';

describe('JobWorkInwardReportComponent', () => {
  let component: JobWorkInwardReportComponent;
  let fixture: ComponentFixture<JobWorkInwardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWorkInwardReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobWorkInwardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
