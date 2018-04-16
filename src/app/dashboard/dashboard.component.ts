import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GenericService } from '../@core/services/generic.service';
import { DealService } from '../@core/services/deal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [ GenericService, DealService ]
})
export class DashboardComponent implements OnInit {

    quotation: any;
    dashboardData: any;
    checkBalanceArray: Array<Balance>;
    remittanceBalanceArray: Array<Balance>;
    today = Date.now();
    balance: any;
    loggedUser: any;

    constructor(
        private router: Router,
        private _genericService: GenericService,
        private _dealService: DealService,
    ) {
        if(!localStorage.getItem('triplus_token')) {
            router.navigate(['auth']);
        }
        this.balance = 0;
    }

    ngOnInit() {
        this.loggedUser = JSON.parse(localStorage.getItem('triplus_loggedUser'));
        if(this.loggedUser.client_id == 1) {
            this.getQuotation();
            this.getDashboardData();
            this.getCheckBalance();
            this.getRemittanceBalance();
        }
    }

    getQuotation() {
        this._genericService.quotation()
            .subscribe(res => {
                this.quotation = res;
            });
    }

    getDashboardData() {
        this._genericService.dashboard()
            .subscribe(res => {
                this.dashboardData = res;
            });
    }

    getCheckBalance() {
        this.checkBalanceArray = [];
        let checkCurrentBalance = 0;

        this._dealService.balanceByType('check')
            .subscribe(res => {
                for(let i of res.data) {
                    let amount = i.amount - (i.amount * i.sales_charge / 100);

                    checkCurrentBalance = checkCurrentBalance + amount;

                    let balance = new Balance;
                    balance.type = i.transaction_type;
                    balance.name = i.name;
                    balance.amount = amount;
                    balance.balance = checkCurrentBalance;

                    this.checkBalanceArray.push(balance);
                }
                this.balance += +checkCurrentBalance;
            });
    }

    getRemittanceBalance() {
        this.remittanceBalanceArray = [];
        let remittanceCurrentBalance = 0;

        this._dealService.balanceByType('remittance')
            .subscribe(res => {
                for(let i of res.data) {
                    let amount = +i.rate + +i.credit;

                    remittanceCurrentBalance = remittanceCurrentBalance + amount;

                    let balance = new Balance;
                    balance.type = i.transaction_type;
                    balance.name = i.name;
                    balance.amount = amount;
                    balance.balance = remittanceCurrentBalance;

                    this.remittanceBalanceArray.push(balance);
                }
                this.balance += +remittanceCurrentBalance;
            });
    }

}

class Balance {
    public type: string;
    public name: string;
    public amount: number;
    public balance: number;
}

