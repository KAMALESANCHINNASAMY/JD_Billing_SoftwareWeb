import { Component, OnInit } from '@angular/core';
import { ThirdPartyReportsService } from 'src/app/api-service/third-party-reports/third-party-purchase-reports.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-purchase-returngst-return',
  templateUrl: './purchase-returngst-return.component.html',
  styleUrl: './purchase-returngst-return.component.scss',
  providers: [DatePipe]
})
export class PurchaseReturngstReturnComponent implements OnInit {
  thirdPartyDetailsList: any[] = [];
  returnReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  ngOnInit() {
    this.getThirdPartyList();
  }

  constructor(private tHMSVC: thirdPartyMasterService,
    private TMRSVC: ThirdPartyReportsService,
    private datePipe: DatePipe,
    private notificationSvc: NotificationsService,
  ) { }

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
      this.TMRSVC.getThirdPartygstPurchaseReturnFromToDate(fromDate, toDate, cusId, this.companyID).subscribe((res) => {
        this.returnReports = res;
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
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  totalQty() {
    let qty = 0;
    qty = this.returnReports.reduce((acc: any, item: any) => (acc += Number(item.return_qty)), 0);
    return qty;
  }

  total_nettotal() {
    let return_net_total = 0;
    return_net_total = this.returnReports.reduce((acc: any, item: any) => (acc += Number(item.return_net_total)), 0);
    return return_net_total;
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
