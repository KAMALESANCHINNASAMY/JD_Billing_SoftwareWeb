import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { weaversReportService } from 'src/app/api-service/WeaversReport/Weaversreports.service';
import { weaverMasterService } from 'src/app/api-service/weaverMaster.service';

@Component({
  selector: 'app-wevers-wise-report',
  standalone: false,
  templateUrl: './wevers-wise-report.component.html',
  styleUrl: './wevers-wise-report.component.scss',
  providers: [DatePipe]
})
export class WeversWiseReportComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  weaverDetailsList: any[] = [];
  reportsList: any[] = [];
  constructor(
    private notificationSvc: NotificationsService,
    private wMSvc: weaverMasterService,
    private WRSvc: weaversReportService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.getWeaverList();
  }
  getWeaverList() {
    this.wMSvc.getList(this.companyID).subscribe((res: any) => {
      this.weaverDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.weaverDetailsList.filter((item) =>
      item.weaver_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.weaverDetailsList;
  }

  getReport(weaverid: any) {
    if (weaverid >= 0) {
      this.WRSvc.getWeaversid(weaverid, this.companyID).subscribe(
        (res) => {
          this.reportsList = res;
        }
      );
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
    }
  }

  TotGgram() {
    let g_gram = 0;
    g_gram = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.g_gram)), 0);
    return g_gram.toFixed(2);
  }

  TotTot() {
    let g_total = 0;
    g_total = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.g_total)), 0);
    return g_total.toFixed(2);
  }

  TotGAdvance() {
    let g_advance = 0;
    g_advance = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.g_advance)), 0);
    return g_advance.toFixed(2);
  }

  TotQty() {
    let qty = 0;
    qty = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty.toFixed(2);
  }

  TotRgram() {
    let r_gram = 0;
    r_gram = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.r_gram)), 0);
    return r_gram.toFixed(2);
  }
  TotRad() {
    let r_advance = 0;
    r_advance = this.reportsList.reduce((acc: any, item: any) => (acc += Number(item.r_advance)), 0);
    return r_advance.toFixed(2);
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
