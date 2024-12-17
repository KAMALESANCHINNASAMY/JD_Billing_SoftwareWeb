import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { jobHandlingReportService } from 'src/app/api-service/jobHandlingReport.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-job-work-inward-report',
  templateUrl: './job-work-inward-report.component.html',
  styleUrl: './job-work-inward-report.component.scss'
})
export class JobWorkInwardReportComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  productList: any[] = [];
  Productsuggestions: any[] = [];

  constructor(private rpSvc: jobHandlingReportService,
    private tHMSVC: thirdPartyMasterService,
    private pSvc: productMasterService,
  ) { }

  ngOnInit() {
    this.getThirdPartyList();
    this.getProductList();
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

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res;
      this.Productsuggestions = res;
    })
  }

  Productsuggest(value: any) {
    this.Productsuggestions = this.productList.filter(item =>
      item.product_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.Productsuggestions.length < 1) this.Productsuggestions = this.productList
  }

  reportForm = new FormGroup({
    third_partyid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    productid: new FormControl(null)
  })

  async getReport() {
    const id = this.reportForm.value.third_partyid;
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    const proId = this.reportForm.value.productid;
    if (this.reportForm.valid) {
      const res = await this.rpSvc.jobInwardReport(this.companyID, id, fromdate, todate, proId).toPromise();
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

  GetNetTotal() {
    let total = 0;
    total = this.purchaseReports.reduce((acc, item) => acc + Number(item.net_total), 0);
    return total;
  }
}
