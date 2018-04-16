import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import filestack from 'filestack-js';

import "rxjs/add/operator/distinctUntilChanged";  
import "rxjs/add/operator/debounceTime";

import { Client } from '../@core/models/client.model';
import { ClientsService } from '../@core/services/clients.service';

import { Check } from '../@core/models/check.model';
import { CheckService } from '../@core/services/check.service';

import { Deal } from '../@core/models/deal.model';
import { DealService } from '../@core/services/deal.service';

declare var $: any;
declare var swal: any;

const apikey = 'AABcNPAY1SNemaJ44dH6Xz';
const filestackClient = filestack.init(apikey);

@Component({
  selector: 'app-check',
  templateUrl: './checks.component.html',
  styleUrls: ['../clients/clients.component.css'],
  providers: [ClientsService, CheckService, DealService, {provide: LOCALE_ID, useValue: 'en-US'}]
})

export class ChecksComponent implements OnInit {
  search = new FormControl();

  checkArraySelected: Array<Check>;
  checkArraySelectedSum: number;
  checkNoFilterArray: Array<Check>;
  checkArray: Array<Check>;
  checkSelected: Check;
  checkForm: FormGroup;
  checkDebitForm: FormGroup;
  clientArray: Array<Client>;

  page: string;

  showAllChecks: boolean;

  selectedFile: string;

  constructor(
    public _checkService: CheckService,
    public _clientService: ClientsService,
    public _dealService: DealService,
    public builder: FormBuilder, 
    ) {
    this.page = 'list';

    this.selectedFile = '';

    this.checkArraySelectedSum = 0;
    this.checkArraySelected = [];

    this.search.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((title: string) => {
        this.checkArray = this.checkNoFilterArray.filter( item => 
          item.customer.name.toLowerCase().indexOf(title.toLowerCase()) > -1 || 
          item.number.toString().indexOf(title.toLowerCase()) > -1
        );
      });

    this.checkForm = builder.group({
      date: '',
      number: '',
      bank: '',
      agency: '',
      account: '',
      amount: '',
      emitter_name: '',
      emitter_doc: '',
      notes: '',
      status: '',
      customer_id: '',
    });


    this.checkDebitForm = builder.group({
      customer_id: '',
      sales_charge: 0,
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
  }

  showModal(): void {
    this.page = 'form';
  }

  getChecks(): void {
    this._checkService.activeCollection()
    .then(res => {
      this.checkArray = res;
      this.checkArray.map(check => {
        check.customer = this.clientArray.find(client => {
          return client.id === check.customer_id;
        })
      });
      this.checkNoFilterArray = this.checkArray;
      this.showAllChecks = false;
    });
  }

  getClients(): void {
    this._clientService.collection()
    .then(res => {
      this.clientArray = res;
      this.getChecks();
    });
  }

  getAllChecks() {
    this._checkService.collection()
    .then(res => {
      this.checkArray = res;
      this.checkArray.map(check => {
        check.customer = this.clientArray.find(client => {
          return client.id === check.customer_id;
        })
      });
      this.checkNoFilterArray = this.checkArray;
      this.showAllChecks = true;
    });
  }

  onSubmit(): void {
    const form = this.checkForm;

    let check = new Check();
    check.populate(form.value);
    check.photo = this.selectedFile;

    this.persiste(check);
  }

  persiste(check: Check) {

    if(this.checkSelected) {
      check.id = this.checkSelected.id;
    }

    this._checkService.persist(check).then(res => {
      this.getChecks();
      this.closeModal();        
    });

  }

  closeModal() {
    this.checkSelected = null;
    this.checkForm.reset();
    this.selectedFile = '';

    this.page = 'list';
  }

  update(check: Check) {
    this.checkSelected = check;
    this.selectedFile = check.photo;
    this.checkForm.reset(check);
    this.showModal();
  }

  remove(check: Check) {

    swal({
      title: 'Você quer remover esse cheque?',
      text: 'Você não poderá reverter essa ação depois que confirmar',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(
    (result) => {
      const index = this.checkArray.indexOf(check);
      this.checkArray.splice(index, 1);

      this._checkService.delete(check.id).subscribe(res => {
        console.log(res);
      });
    }, 
    (cancel) => {}
    );

  }

  onCheckChecked(check: Check) {
    if(!this.checkArraySelected) {
      this.checkArraySelected = [];
    }
    check.selected = !check.selected;
    this.checkArraySelected = this.checkArray.filter(item => item.selected === true);
    this.checkArraySelectedSum = 0;
    this.checkArraySelected.map(item => {
      this.checkArraySelectedSum += +item.amount;
    });
  }

  checkDebit() {
    $('#check-debit').modal();
  }

  onCheckDebitSubmit() {
    const form = this.checkDebitForm;
    console.log(form.value);
    let now = Date.now();
    let date = this.formatDate(now);
    let time = this.formatTime(now);
    console.log(this.checkArraySelected);

    let dealSuccess = 0;

    $('#check-debit').modal('hide');
    this.page = 'loading';

    for(let check of this.checkArraySelected) {
      let deal = new Deal;
      deal.populate({
        date: date,
        time: time,
        description: '',
        customer_id: form.value.customer_id,
        check_id: check.id,
        type: 'check',
        credit: 0,
        debit: 0,
        purchase_rate: 0,
        sales_charge: form.value.sales_charge,
        transaction_type: 'output',
        rate: 0
      });

      this._dealService.create(deal).subscribe(res => {
        dealSuccess++;
        if(dealSuccess == this.checkArraySelected.length) {

          swal(
            'Sucesso!',
            'Os cheques foram debitados com sucesso!',
            'success'
          )

          this.checkArraySelected = [];
          this.page = 'list';
          this.getChecks();
        }
      }, err => {
        swal(
            'Ops...!',
            'Alguns cheques não foram debitados!',
            'error'
          )

          this.checkArraySelected = [];
          this.page = 'list';
          this.getChecks();
      });
    }


  }

  showFilePicker() {
    filestackClient.pick({
      fromSources:["local_file_system","webcam"],
      accept:["image/*"],
      maxFiles:1,
      transformations:{
        crop:{
          force:true,
          aspectRatio:1
        }
      }
    }).then(res => {
      this.selectedFile = res.filesUploaded[0].url;
    });
  }


}
