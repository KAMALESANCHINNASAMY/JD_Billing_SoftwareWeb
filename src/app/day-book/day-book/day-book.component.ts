import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { dayBookReportService } from 'src/app/api-service/dayBook.service';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrl: './day-book.component.scss'
})
export class DayBookComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(private rpSvc: dayBookReportService
  ) { }

  ngOnInit() {

  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl('')
  })

  async getReport() {
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      const res = await this.rpSvc.saleList(this.companyID, fromdate, todate).toPromise();
      this.purchaseReports = res || [];

      console.log(res)
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
