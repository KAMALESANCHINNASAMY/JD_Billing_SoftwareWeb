import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StockManagementService } from 'src/app/api-service/stocks/stock-management.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { weaverMasterService } from 'src/app/api-service/weaverMaster.service';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.scss',
})
export class StockManagementComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  stockDetails: any[] = [];
  weaverDetailsList: any[] = [];
  suggestions: any[] = [];
  thirdPartyDetailsList: any[] = [];
  suggestionsParty: any[] = [];
  ngOnInit() {
    this.getWeaverList();
    this.getThirdPartyList();
  }

  constructor(private STMSVC: StockManagementService,
    private wMSvc: weaverMasterService,
    private tHMSVC: thirdPartyMasterService,) { }

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


  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestionsParty = res;
    });
  }

  suggestParty(value: any) {
    this.suggestionsParty = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestionsParty.length < 1)
      this.suggestionsParty = this.thirdPartyDetailsList;
  }


  search() {
    debugger
    const type = this.reportForm.value.type || '';
    const weaverId = this.reportForm.value.weaverid || 0;
    const thirdpartyID = this.reportForm.value.third_partyid || 0;
    const fromdate = this.reportForm.value.fromdate || '';
    const todate = this.reportForm.value.todate || '';
    const si_code = this.reportForm.value.si_code || '';

    if (type == 'Weavers') {
      this.STMSVC.getStockDetailsByweaver(weaverId, this.companyID).subscribe((res) => {
        this.stockDetails = res;
      });
    }
    else if (type == 'ThirdPartyGst') {
      this.STMSVC.getStockDetailsByThirdPartyGst(thirdpartyID, this.companyID).subscribe((res) => {
        this.stockDetails = res;
      });
    }
    else if (type == 'ThirdPartyNonGst') {
      this.STMSVC.getStockDetailsByThirdPartyNonGst(thirdpartyID, this.companyID).subscribe((res) => {
        this.stockDetails = res;
      });
    }
    else {
      this.STMSVC.getStockDetails(type, fromdate, todate, si_code, this.companyID).subscribe((res) => {
        this.stockDetails = res;
      });
    }
  }

  reportForm = new FormGroup({
    type: new FormControl('date'),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    si_code: new FormControl(''),
    weaverid: new FormControl(0),
    third_partyid: new FormControl(0)
  });
}
