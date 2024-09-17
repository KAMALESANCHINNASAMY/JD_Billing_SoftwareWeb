import { Component } from '@angular/core';
import { ThirdPartyReportsService } from 'src/app/api-service/third-party-reports/third-party-purchase-reports.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { DatePipe } from '@angular/common';
import { thirdPartyPurchaseService } from 'src/app/api-service/Accounts/thirdPartyPurchase.service';
import { ThirdPartyNongstPurchaseReportService } from 'src/app/api-service/reports/thirdPartyNongstPurchaseReport.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-party-wise-nongstpurchase-reports',
  templateUrl: './party-wise-nongstpurchase-reports.component.html',
  styleUrl: './party-wise-nongstpurchase-reports.component.scss',
  providers: [DatePipe]
})
export class PartyWiseNongstpurchaseReportsComponent {

  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  thirdPartyPurchaseList: any[] = [];

  ngOnInit() {
    this.getThirdPartyList();
  }
  constructor(private tHMSVC: thirdPartyMasterService,
    private tPPSvc: thirdPartyPurchaseService,
    private TPRSVC: ThirdPartyReportsService,
    private datePipe: DatePipe,
    private TPPNGSTRSVC: ThirdPartyNongstPurchaseReportService,
    private notificationSvc: NotificationsService,
  ) { }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  async getReport(purchaseid: any) {
    const thirdPartyNongstPurchaseReports = await this.tPPSvc.getThirdPartyPurchaseReport(purchaseid).toPromise();
    this.TPPNGSTRSVC.openConfirmDialog(thirdPartyNongstPurchaseReports)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  setThirdPartyDetails(id: any) {
    if (id >= 0) {
      this.TPRSVC.getThirdPartyNongstPurchasebyPartyId(id, this.companyID).subscribe(
        (res) => {
          this.thirdPartyPurchaseList = res;
        }
      );
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
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
    qty = this.thirdPartyPurchaseList.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty;
  }

  total_nettotal() {
    let total = 0;
    total = this.thirdPartyPurchaseList.reduce((acc: any, item: any) => (acc += Number(item.total)), 0);
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
