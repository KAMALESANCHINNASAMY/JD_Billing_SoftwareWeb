import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profit-loss-statement',
  templateUrl: './profit-loss-statement.component.html',
  styleUrl: './profit-loss-statement.component.scss'
})
export class ProfitLossStatementComponent {


  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl('')
  });


  async getReport() { 
    if (this.reportForm.valid) {
     
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }
}
