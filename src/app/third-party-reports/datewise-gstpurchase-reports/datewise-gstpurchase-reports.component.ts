import { Component, OnInit } from '@angular/core';
import { ThirdPartyReportsService } from 'src/app/api-service/third-party-reports/third-party-purchase-reports.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-datewise-gstpurchase-reports',
  templateUrl: './datewise-gstpurchase-reports.component.html',
  styleUrl: './datewise-gstpurchase-reports.component.scss',
  providers: [DatePipe]
})
export class DatewiseGstpurchaseReportsComponent implements OnInit {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];

  constructor(private TPPRSVC: ThirdPartyReportsService,
    private tHMSVC: thirdPartyMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getThirdPartyList();
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    third_partyid: new FormControl(null)
  });

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  getThirdPartyPurReportByFromTodate() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.third_partyid;
      this.TPPRSVC.getThirdPartyPurchaseFromToDate(fromDate, toDate, cusId, this.companyID).subscribe((res) => {
        this.purchaseReports = res;
      });
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.thirdPartyDetailsList;
  }

  totalQty() {
    let qty = 0;
    qty = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty;
  }

  total_nettotal() {
    let total = 0;
    total = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.total)), 0);
    return total;
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

}
