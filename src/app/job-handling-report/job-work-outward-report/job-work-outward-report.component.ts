import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { jobHandlingReportService } from 'src/app/api-service/jobHandlingReport.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-job-work-outward-report',
  templateUrl: './job-work-outward-report.component.html',
  styleUrl: './job-work-outward-report.component.scss'
})
export class JobWorkOutwardReportComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];

  constructor(private rpSvc: jobHandlingReportService,
    private pSvc: productMasterService,
    private tHMSVC: thirdPartyMasterService,
  ) { }

  ngOnInit() {
    this.getThirdPartyList();
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter(item =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.thirdPartyDetailsList
  }

  reportForm = new FormGroup({
    third_partyid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl('')
  })

  async getReport() {
    const id = this.reportForm.value.third_partyid;
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      const res = await this.rpSvc.jobOutwardReport(this.companyID, id, fromdate, todate).toPromise();
      this.purchaseReports = res || [];
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }

  getNetQty() {
    let total = 0;
    total = this.purchaseReports.reduce((acc, item) => acc + Number(item.qty), 0);
    return total;
  }
}
