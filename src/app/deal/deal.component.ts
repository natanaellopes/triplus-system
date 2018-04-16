import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';

import { Client } from '../@core/models/client.model';
import { ClientsService } from '../@core/services/clients.service';

import { Check } from '../@core/models/check.model';
import { CheckService } from '../@core/services/check.service';

import { Deal } from '../@core/models/deal.model';
import { DealService } from '../@core/services/deal.service';

import { GenericService } from '../@core/services/generic.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  providers: [ClientsService, CheckService, DealService, GenericService, {provide: LOCALE_ID, useValue: 'pt-BR'}]
})

export class DealComponent implements OnInit {

  checkArray: Array<Check>;
  clientArray: Array<Client>;
  dealArray: Array<Deal>;
  checkDealArray: Array<Deal>;
  remittanceDealArray: Array<Deal>;

  dealSelected: Deal;
  dealForm: FormGroup;

  showForm: boolean;

  now = Date.now();

  quotation: number;

  cashback: number;

  constructor(
    public _checkService: CheckService,
    public _clientService: ClientsService,
    public _dealService: DealService,
    public _genericService: GenericService,
    public builder: FormBuilder, 
    ) {

    let now = new Date().toISOString();

    this.cashback = 0;

    this.dealForm = builder.group({
      date: this.formatDate(now),
      time: this.formatTime(now),
      description: '',
      customer_id: '',
      check_id: '',
      type: '',
      credit: 0,
      debit: 0,
      purchase_rate: 0,
      sales_charge: 0,
      rate: 0,
      transaction_type: 'input',
      actual_quotation: '',
      done_quotation: ''
    });
  }

  getQuotation() {
    this._genericService.quotation()
      .subscribe(res => {
          this.quotation = res;
          let value = parseFloat(res.valores.USD.valor).toFixed(2);
          this.dealForm.patchValue({
            actual_quotation: value,
            done_quotation: value,
          });
      });
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  checkNumber(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }


  formatTime(date) {
    var d = new Date(date);
    var h = '' + d.getHours();
    var m = '' + d.getMinutes();

    if (h.length < 2) h = '0' + h;
    if (m.length < 2) m = '0' + m;

    return h + ":" + m;
  }

  ngOnInit() {
    this.getClients();
    this.getQuotation();
  }

  getDeals(): void {
    this._dealService.collection()
    .then(res => {

      let deals = [];

      for(let i of res) {
        if(i.type == 'check') {
          let check = this.checkArray.find(item => {
            return item.id === i.check_id;
          });
          i.deal_check = check;
        }else{
          i.deal_check = new Check;
        }

        let customer = this.clientArray.find(item => {
          return item.id === i.customer_id;
        });

        i.deal_customer = customer;

        deals.push(i);
      }

      this.dealArray = deals;
      this.checkDealArray = this.dealArray.filter(item => {
        return item.type === 'check';
      })
      this.remittanceDealArray = this.dealArray.filter(item => {
        return item.type === 'remittance';
      })
    });
  }

  getClients(): void {
    this._clientService.collection()
    .then(res => {
      this.clientArray = res;
      this.getChecks();
    });
  }

  getChecks(): void {
    this._checkService.collection()
    .then(res => {
      this.checkArray = res;
      this.getDeals();
    });
  }

  onSubmit(): void {
    const form = this.dealForm;

    this.persiste(form.value);
  }

  persiste(deal: Deal) {

    if(this.dealSelected) {
      deal.id = this.dealSelected.id;
    }

    this._dealService.persist(deal).then(res => {
      if(!this.dealSelected) {
        this.dealArray.push(this.populateDeal(deal));
      }else{
        const item = this.dealArray.find(item => {
          return item.id === this.dealSelected.id;
        });
        const index = this.dealArray.indexOf(item);
        this.dealArray[index] = this.populateDeal(deal);
      }
      this.getDeals();

      this.closeModal();
    });       

  }

  populateDeal(deal: Deal): Deal {
    let check: Check;
    if(deal.type == 'check') {
      check = this.checkArray.find(item => {
        return item.id === deal.check_id;
      });
    }else{
      check = new Check;
    }

    let customer = this.clientArray.find(item => {
      return item.id === deal.customer_id;
    });

    deal.deal_check = check;
    deal.deal_customer = customer;

   return deal;
  }


  closeModal() {
    this.dealSelected = null;
    let now = new Date().toISOString();
    this.dealForm.reset({
      'date': this.formatDate(now),
      'time': this.formatTime(now),
    });
    this.showForm = false;
  }

  update(deal: Deal) {
    this.getQuotation();

    this.dealSelected = deal;
    this.dealForm.reset(deal);
    this.showForm = true;
  }

  remove(deal: Deal) {

    swal({
      title: 'Você quer remover esse cliente?',
      text: 'Você não poderá reverter essa ação depois que confirmar',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(
    (result) => {
      const index = this.dealArray.indexOf(deal);
      this.dealArray.splice(index, 1);

      this._dealService.delete(deal.id).subscribe(res => {
        this.getDeals();
      });
    }, 
    (cancel) => {}
    );

  }

  cashbackCalc() {
    let check = this.checkArray.find(item => item.id === this.dealForm.value.check_id);
    this.cashback = check.amount - (check.amount * this.dealForm.value.purchase_rate / 100);
  }

}
