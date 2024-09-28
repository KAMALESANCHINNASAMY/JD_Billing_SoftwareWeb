import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../api-service/Dialog.service';
import { layOutService } from '../api-service/layout/layout.service';
import { companyDetailsService } from '../api-service/companyMaster.service';
import { backUpDataBaseService } from '../api-service/backUpDataBase.service';
import { NotificationsService } from 'angular2-notifications';
import { financialYearService } from '../api-service/financialYear.service';

@Component({
  selector: 'layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  userId: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  companyIds: any[] = [];
  userName: String = '';
  CompanyName: string = '';
  openSidebar: boolean = true;
  companyDetailsList: any[] = [];
  financialYearList: any[] = [];
  activeFinyr: string = '';
  mainMenu: any;
  subMenu: any;
  filteredMenu: any[];

  menuSidebar = [
    {
      link_name: 'Dashboard',
      link: 'dashboard/dashboard',
      icon: 'dashboards',
      isselect: false,
      value: 10,
      sub_menu: [],
    },
    {
      link_name: 'Payments',
      link: 'payments',
      icon: 'rupee',
      isselect: false,
      value: 11,
      sub_menu: [
        {
          link_name: 'Sales Payment',
          link: 'payments/customer-payments',
          isselect: false,
          value: 1101
        },
        {
          link_name: 'Third-Party Payment',
          link: 'payments/third-party-payments',
          isselect: false,
          value: 1102
        },
        {
          link_name: 'Supplier Payment',
          link: 'payments/supplier-payments',
          isselect: false,
          value: 1103
        }
      ]
    },
    {
      link_name: 'Purchase & Sales',
      link: 'accounts',
      icon: 'investor',
      isselect: false,
      value: 12,
      sub_menu: [
        {
          link_name: 'Raw Material Purchase',
          link: 'accounts/raw-material',
          isselect: false,
          value: 1201
        },
        {
          link_name: 'Raw Product Purchase',
          link: 'accounts/raw-product',
          isselect: false,
          value: 1207
        },
        {
          link_name: 'Third-Party purchase',
          link: 'accounts/thirdparty-sareegst',
          isselect: false,
          value: 1202
        }, {
          link_name: 'Weavers Sarees',
          link: 'accounts/weavers-sarees',
          isselect: false,
          value: 1203
        },
        {
          link_name: 'Weavers Sarees',
          link: 'accounts/weavers_with_given_recived',
          isselect: false,
          value: 1204
        },
        {
          link_name: 'Sales Entry/Bill Entry',
          link: 'accounts/salesbill-entry',
          isselect: false,
          value: 1205
        },
        {
          link_name: 'Sales Entry',
          link: 'accounts/multiple-sales-withGST',
          isselect: false,
          value: 1206
        },
        {
          link_name: 'Sale Products',
          link: 'accounts/sale-products',
          isselect: false,
          value: 1208
        },
        {
          link_name: 'Expense Entry',
          link: 'accounts/expense-entry',
          isselect: false,
          value: 1209
        }
      ],
    },
    {
      link_name: 'Return Credit/Debit-note',
      link: null,
      icon: 'return',
      isselect: false,
      value: 13,
      sub_menu: [{
        link_name: 'Sales Return',
        link: 'returnCredit-Debit/salesbill-debitgst',
        isselect: false,
        value: 1301
      },
      {
        link_name: 'Third-Party Return',
        link: 'accounts/third-partygst-debit-note',
        isselect: false,
        value: 1302
      }, {
        link_name: 'Supplier Return',
        link: 'accounts/debit-note',
        isselect: false,
        value: 1303
      }
      ],
    },
    {
      link_name: 'Raw Material Reports',
      link: null,
      icon: 'salesreport',
      isselect: false,
      value: 14,
      sub_menu: [{
        link_name: 'Datewise Purchase Reports',
        link: 'rawmaterialpurchase-report/datewise-rawpurchase',
        isselect: false,
        value: 1401
      },
      // {
      //   link_name: 'Supplier BillNoWise Reports',
      //   link: 'rawmaterialpurchase-report/suppbillno-rawpurchase',
      //isselect: false,
      //value: 1402
      // },
      {
        link_name: 'Supplier Wise Reports',
        link: 'rawmaterialpurchase-report/supplierwise-rawpurchase',
        isselect: false,
        value: 1403
      }, {
        link_name: 'Purchase Return Reports',
        link: 'rawmaterialpurchase-report/purchasereturn-rawpurchase',
        isselect: false,
        value: 1404
      }, {
        link_name: 'Bill No Wise Payment Reports',
        link: 'rawmaterialpurchase-report/purchasepayment-rawpurchase',
        isselect: false,
        value: 1405
      },
      {
        link_name: 'Supplier Payment Reports',
        link: 'rawmaterialpurchase-report/supplierpayment',
        isselect: false,
        value: 1406
      },
      {
        link_name: 'Supplier Ledger Reports',
        link: 'rawmaterialpurchase-report/supplierledger',
        isselect: false,
        value: 1407
      }
      ],
    },
    {
      link_name: 'Third Party Reports',
      link: null,
      icon: 'salesreport',
      isselect: false,
      value: 15,
      sub_menu: [{
        link_name: 'Datewise Purchase Reports',
        link: 'third-party-reports/datewisegst-reports',
        isselect: false,
        value: 1501
      },
      // {
      //   link_name: 'SareeWise Purchase Reports',
      //   link: 'third-party-reports/sareewisegst-reports',
      //isselect: false,
      //value: 1502
      // },
      {
        link_name: 'PartyWise Purchase Reports',
        link: 'third-party-reports/party-wisegst-reports',
        isselect: false,
        value: 1503
      }, {
        link_name: 'Purchase Return Reports',
        link: 'third-party-reports/purchase-return-reports',
        isselect: false,
        value: 1504
      }, {
        link_name: 'Bill Wise Payment Reports',
        link: 'third-party-reports/thirdprty-payment-reports',
        isselect: false,
        value: 1505
      },
      {
        link_name: 'Third Party Payment Reports',
        link: 'third-party-reports/thirdprty-payment',
        isselect: false,
        value: 1506
      },
      {
        link_name: 'Third Party Ledger',
        link: 'third-party-reports/thirdprty-gst-ledger',
        isselect: false,
        value: 1507
      }
      ]
    },
    {
      link_name: 'Sales Reports',
      link: null,
      icon: 'salesreport',
      isselect: false,
      value: 16,
      sub_menu: [
        {
          link_name: 'Datewise Sales Reports',
          link: 'sales-report/datewise',
          isselect: false,
          value: 1601
        },
        // {
        //   link_name: 'Saree Wise Reports',
        //   link: 'sales-report/sareewise-custwise',
        //isselect: false,
        //value: 1602
        // },
        {
          link_name: 'Customer Wise Reports',
          link: 'sales-report/customerwise-gst',
          isselect: false,
          value: 1603
        },
        {
          link_name: 'Sales Return Reports',
          link: 'sales-report/sales-return-gst',
          isselect: false,
          value: 1604
        }, {
          link_name: 'Bill No Wise Payment Reports',
          link: 'sales-report/sales-payment-gst',
          isselect: false,
          value: 1605
        },
        {
          link_name: 'Customer Payment Reports',
          link: 'sales-report/customerpayment',
          isselect: false,
          value: 1606
        },
        {
          link_name: 'Sales Ledger Reports',
          link: 'sales-report/sales-ledger',
          isselect: false,
          value: 1607
        },
        {
          link_name: 'Print Customer Address',
          link: 'stocks/address_print',
          isselect: false,
          value: 1608
        }
      ]
    },
    {
      link_name: 'Weavers Reports',
      link: null,
      icon: 'salesreport',
      isselect: false,
      value: 22,
      sub_menu: [{
        link_name: 'Datewise Reports',
        link: 'weaversreports/date_wise_report',
        isselect: false,
        value: 2201
      },
      {
        link_name: 'Weavers Wise Reports',
        link: 'weaversreports/weavers_wise_report',
        isselect: false,
        value: 2202
      }
      ]
    },
    {
      link_name: 'Stock Management',
      link: null,
      icon: 'stock',
      isselect: false,
      value: 17,
      sub_menu: [{
        link_name: 'Stock Details',
        link: 'stocks/stock-management'
      }
      ]
    },

    // {
    //   link_name: 'Saree History',
    //   link: null,
    //   icon: 'sareehistory',
    //   sub_menu: [{
    //     link_name: 'GST sarees History',
    //     link: 'saree-history/gst-sareehistory'
    //   }],
    // },

    {
      link_name: 'Masters',
      link: null,
      icon: 'icon',
      isselect: false,
      value: 18,
      sub_menu: [
        {
          link_name: 'Customer Master',
          link: 'master/customer-master',
          isselect: false,
          value: 1801
        },
        {
          link_name: 'Supplier Master',
          link: 'master/supplier-master',
          isselect: false,
          value: 1802
        },
        {
          link_name: 'Weaver Master',
          link: 'master/weaver-master',
          isselect: false,
          value: 1803
        },
        {
          link_name: 'Third-Party-Master',
          link: 'master/third-party-master',
          isselect: false,
          value: 1804
        },
        {
          link_name: 'Financial Year',
          link: 'master/financial-year',
          isselect: false,
          value: 1805
        },
        {
          link_name: 'Expense Master',
          link: 'master/expense-master',
          isselect: false,
          value: 1806
        },
        {
          link_name: 'Hand Cash Entry',
          link: 'master/hand-cash',
          isselect: false,
          value: 1807
        }
      ],
    },
    {
      link_name: 'Inventory',
      link: null,
      icon: 'inventory',
      isselect: false,
      value: 19,
      sub_menu: [
        {
          link_name: 'Unit Master',
          link: 'inventory/unit-master',
          isselect: false,
          value: 1901
        },
        {
          link_name: 'GST Master',
          link: 'inventory/gst-master',
          isselect: false,
          value: 1902
        },
        {
          link_name: 'HSN Group',
          link: 'inventory/hsn-group',
          isselect: false,
          value: 1903
        },
        {
          link_name: 'Item-Group',
          link: 'inventory/item-group',
          isselect: false,
          value: 1904
        },
        {
          link_name: 'Brand-Master',
          link: 'inventory/brand-master',
          isselect: false,
          value: 1905
        },
        {
          link_name: 'Item Master',
          link: 'inventory/item-master',
          isselect: false,
          value: 1906
        },
        {
          link_name: 'Sales Product Master',
          link: 'inventory/product-master',
          isselect: false,
          value: 1907
        },
        {
          link_name: 'Purchase Product Master',
          link: 'inventory/n-product-master',
          isselect: false,
          value: 1908
        },
        {
          link_name: 'Link Product Master',
          link: 'inventory/link-product-master',
          isselect: false,
          value: 1909
        }
      ],
    },
    {
      link_name: 'User',
      link: 'user/user',
      icon: 'user',
      isselect: false,
      value: 20,
      sub_menu: [],
    },
    {
      link_name: 'Company',
      link: 'company/company',
      icon: 'company',
      isselect: false,
      value: 21,
      sub_menu: [],
    }
  ];
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private lOSvc: layOutService,
    private CDSVC: companyDetailsService,
    private bUDBSvc: backUpDataBaseService,
    private notificationSvc: NotificationsService,
    private FYDSVC: financialYearService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getLoginUser();
    this.getFinancialYearDetails();
  }

  async getLoginUser(): Promise<any> {
    this.lOSvc.getLoginUserList(this.userId).subscribe((res) => {
      if (res.length > 0) {
        this.userName = res[0].user_name;
        this.companyIds = res[0].s_companyid.split(',').map(Number);

        this.mainMenu = res[0].main_menus;
        this.subMenu = res[0].sub_menus;
        this.filteredMenu = this.menuSidebar
          .filter(menu => this.mainMenu.includes(menu.value))
          .map(menu => {
            const filteredSubmenu = menu.sub_menu.filter((submenu: any) => this.subMenu.includes(submenu.value));
            return { ...menu, sub_menu: filteredSubmenu };
          });

        this.CDSVC.getList().subscribe((res) => {
          this.companyDetailsList = res.filter((e) => {
            return this.companyIds.includes(e.companyid);
          });
          this.companyDetailsList.forEach((e) => {
            e['color'] = this.getRandomColor();
          });
          if (this.companyDetailsList.length > 0) {
            const newArray = this.companyDetailsList.filter((e) => {
              return e.companyid == this.companyID;
            });
            if (newArray.length > 0)
              this.CompanyName = newArray[0].display_name;
          }
        });
      }
    });
  }

  async changeCompany(item: number) {
    await localStorage.removeItem('companyid');
    await localStorage.setItem('companyid', String(item));
    await window.location.reload();
    await window.location.reload();
  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle('showMenu');
  }

  logout() {
    this.DialogSvc.openConfirmDialog('Are you sure want to Log Out ?')
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
      });
  }

  BackUpDB() {
    this.DialogSvc.openConfirmDialog('Are you sure want Back Up this DataBase ?')
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.bUDBSvc.backUp().subscribe((res: any) => {
            if (res.status == 'BackUp Success') {
              this.notificationSvc.success('Backup done successfully');
            }
            else {
              this.notificationSvc.error(res.status)
            }
          })
        }
      });
  }

  getFinancialYearDetails() {
    this.FYDSVC.getFinancialYrList(this.companyID).subscribe((res) => {
      this.financialYearList = res;
      const newArray = res.filter((e) => { return e.status })
      this.activeFinyr = newArray[0].finyear;
      localStorage.setItem("fromdate", newArray[0].fromdate);
      localStorage.setItem("todate", newArray[0].todate);
    });
  }
  ActiveStatusClick(finyearid: any) {
    this.FYDSVC.setActiveFinYear(finyearid, this.companyID).subscribe((res) => {
      if (res?.recordid) {
        this.notificationSvc.success('Financial year changed successfully');
        window.location.reload();
        window.location.reload();
      }
      window.location.reload();
    });
  }
}
