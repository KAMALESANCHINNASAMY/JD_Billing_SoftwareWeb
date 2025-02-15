import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { dayBookReportService } from 'src/app/api-service/dayBook.service';

@Component({
  selector: 'app-profit-loss-statement',
  templateUrl: './profit-loss-statement.component.html',
  styleUrl: './profit-loss-statement.component.scss'
})
export class ProfitLossStatementComponent {
  table_one: any[] = [];
  table_two: any[] = [];
  table_three: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(private dBSvc: dayBookReportService) { }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl('')
  });


  async getReport() {
    if (this.reportForm.valid) {
      const fDate = this.reportForm.value.fromdate;
      const tDate = this.reportForm.value.todate;
      this.dBSvc.getProfitAndLoss(this.companyID, fDate, tDate).subscribe((res) => {
        debugger
        this.table_one = res?.Table_1;
        this.table_two = res?.Table_2;
        this.table_three = res?.Table_3;
      });
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }

  getoldSalesTot() {
    let amount = 0;
    amount = this.table_one.filter((e) => { return e.description === 'Sales' }).reduce((acc, val) => acc += val.old_amount, 0);
    return amount;
  }

  getoldPurchaseTot() {
    let amount = 0;
    amount = this.table_one.filter((e) => { return e.description === 'Purchase' }).reduce((acc, val) => acc += val.old_amount, 0);
    return amount;
  }

  getOldTot() {
    return this.getoldSalesTot() - this.getoldPurchaseTot();
  }

  getExpenTot() {
    let amount = 0;
    amount = this.table_two.reduce((acc, val) => acc += (val.net_amount - val.return_net_amount), 0);
    return amount;
  }

  getIncomeTot() {
    let amount = 0;
    amount = this.table_three.reduce((acc, val) => acc += (val.net_amount - val.return_net_amount), 0);
    return amount;
  }
}
