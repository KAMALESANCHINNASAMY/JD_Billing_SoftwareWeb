import { salesBillingReturnDebitNonGstService } from 'src/app/api-service/Credit-Debit-note/salesBillingReturnDebitNongst.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-sareewise-nongst-customerwise-sales',
  templateUrl: './sareewise-nongst-customerwise-sales.component.html',
  styleUrl: './sareewise-nongst-customerwise-sales.component.scss',
})
export class SareewiseNongstCustomerwiseSalesComponent implements OnInit {
  salesReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  total_Qty: string;
  total_Total: string;
  total_csgt_amount: string;
  total_sgst_amount: string;
  total_igst_amount: string;
  total_net_total: string;
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  form: FormGroup;

  ngOnInit() {
    this.getCustomerList();
  }

  getCustomerList() {
    this.customerDetailsList = [];
    this.suggestions = [];
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }
  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  constructor(
    private SRSVC: SalesReportService,
    private SBNGSTRSVC: salesBillingReturnDebitNonGstService,
    private cMSvc: customerMasterService
  ) {
    this.form = new FormGroup({
      customerid: new FormControl(0),
      ref_code: new FormControl(''),
      si_code: new FormControl(''),
    });
  }

  getSalesReportbySicode(si_code: any) {
    this.form.get('ref_code')?.setValue('');
    this.form.get('customerid')?.setValue(0);
    this.customerDetailsList = [];
    this.salesReports = [];
    this.total_Qty = '';
    this.total_Total = '';
    this.SBNGSTRSVC.getSalesBillingNongstNestedBySiCode(
      this.companyID,
      si_code
    ).subscribe((res) => {
      this.salesReports = res;
      this.getTotals();
    });
  }

  // showCustomerSalesReport(customerid: any) {
  //   this.form.get('ref_code')?.setValue('');
  //   this.form.get('si_code')?.setValue('');
  //   this.customerDetailsList = [];
  //   this.salesReports = [];
  //   this.total_Qty = '';
  //   this.total_Total = '';
  //   this.SRSVC.getNongstSalesReportByCustomerid(
  //     customerid,
  //     this.companyID
  //   ).subscribe((res) => {
  //     this.salesReports = res;
  //     this.getTotals();
  //   });
  // }
  getSalesReportbyRefcode(ref_code: any) {
    this.form.get('si_code')?.setValue('');
    this.form.get('customerid')?.setValue(0);
    this.customerDetailsList = [];
    this.salesReports = [];
    this.total_Qty = '';
    this.total_Total = '';
    this.SBNGSTRSVC.getSalesBillingNongstNestedByRefCode(
      this.companyID,
      ref_code
    ).subscribe((res) => {
      this.salesReports = res;
      this.getTotals();
    });
  }

  getTotals() {
    if (this.salesReports.length != 0) {
      const total_Qty = this.salesReports.reduce(
        (acc: any, item: any) => (acc += Number(item.qty)),
        0
      );
      this.total_Qty = total_Qty;
      const total_Total = this.salesReports.reduce(
        (acc: any, item: any) => (acc += Number(item.total)),
        0
      );
      this.total_Total = total_Total;
      const total_net_total = this.salesReports.reduce(
        (acc: any, item: any) => (acc += Number(item.net_total)),
        0
      );
      this.total_net_total = total_net_total;
    }
  }
}
