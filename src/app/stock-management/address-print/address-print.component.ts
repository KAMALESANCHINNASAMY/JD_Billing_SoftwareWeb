import { Component } from '@angular/core';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';

@Component({
  selector: 'app-address-print',
  templateUrl: './address-print.component.html',
  styleUrl: './address-print.component.scss'
})
export class AddressPrintComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  companyDetailsList: any;
  suggestions: any[] = [];
  countArray: number[];
  data: any;
  ngOnInit() {
    this.getCompanyDetails();
    this.getCustomerList();
  }

  constructor(private cMSvc: customerMasterService,
    private CDSVC: companyDetailsService,) { }

  getCustomerList() {
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

  setval(num: any) {
    this.countArray = Array.from({ length: num }, (_, index) => index + 1);
  }

  setData(option: any) {
    this.data = option;
  }

  getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

}
