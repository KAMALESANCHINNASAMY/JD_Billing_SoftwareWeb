import { Component, OnInit } from '@angular/core';
import { thirdPartyGSTPurchaseService } from 'src/app/api-service/Accounts/thirdPartyGstPurchase.service';
import { ThirdPartyReportsService } from 'src/app/api-service/third-party-reports/third-party-purchase-reports.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { DatePipe } from '@angular/common';
import { ThirdPartyPurchaseReportService } from 'src/app/api-service/reports/thirdPartygstPurchaseReport.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-party-wisegst-reports',
  templateUrl: './party-wisegst-reports.component.html',
  styleUrl: './party-wisegst-reports.component.scss',
  providers: [DatePipe]
})
export class PartyWisegstReportsComponent implements OnInit {

  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  thirdPartyPurchaseList: any[] = [];

  ngOnInit() {
    this.getThirdPartyList();
  }
  constructor(private tHMSVC: thirdPartyMasterService,
    private tPGSTPSvc: thirdPartyGSTPurchaseService,
    private TPRSVC: ThirdPartyReportsService,
    private datePipe: DatePipe,
    private TPGSTRSVC: ThirdPartyPurchaseReportService,
    private notificationSvc: NotificationsService,
  ) { }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  async getReport(purchaseid: any) {
    const thirdPartygstPurchaseReports = await this.tPGSTPSvc.getThirdPartyPurchaseReport(purchaseid).toPromise();
    this.TPGSTRSVC.openConfirmDialog(thirdPartygstPurchaseReports)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  setThirdPartyDetails(id: any) {
    if (id >= 0) {
      this.TPRSVC.getThirdPartygstPurchasebyPartyId(id, this.companyID).subscribe(
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
