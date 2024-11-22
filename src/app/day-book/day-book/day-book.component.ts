import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { bankMasterService } from 'src/app/api-service/bankMaster.service';
import { dayBookReportService } from 'src/app/api-service/dayBook.service';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrl: './day-book.component.scss'
})
export class DayBookComponent {
  purchaseReports: any[] = [];
  bankList: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(private rpSvc: dayBookReportService,
    private bSvc: bankMasterService
  ) { }

  ngOnInit() {
    this.getBankList();
  }

  getBankList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.bankList = res
    })
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    bankid: new FormControl(0)
  })

  async getReport() {
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    const bankID = this.reportForm.value.bankid;
    debugger
    if (this.reportForm.valid) {
      const res = await this.rpSvc.saleList(this.companyID, fromdate, todate, Number(bankID)).toPromise();
      this.purchaseReports = res || [];
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }

  getTotIncome() {
    let amount = 0;
    amount = this.purchaseReports.reduce((acc, val) => acc += val.income, 0);
    return amount.toFixed(2);
  }

  getTotExpense() {
    let amount = 0;
    amount = this.purchaseReports.reduce((acc, val) => acc += val.expense, 0);
    return amount.toFixed(2);
  }
}
