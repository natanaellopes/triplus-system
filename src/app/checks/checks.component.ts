import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../@core/models/client.model';
import { ClientsService } from '../@core/services/clients.service';

import { Check } from '../@core/models/check.model';
import { CheckService } from '../@core/services/check.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-check',
  templateUrl: './checks.component.html',
  providers: [ClientsService, CheckService]
})

export class ChecksComponent implements OnInit {

  checkArray: Array<Check>;
  clientArray: Array<Client>;
  checkSelected: Check;
  checkForm: FormGroup;

  constructor(
    public _checkService: CheckService,
    public _clientService: ClientsService,
    public builder: FormBuilder, 
    ) {
    this.checkForm = builder.group({
      client_id: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.getClients();
    this.getChecks();
  }

  getClients(): void {
    this._clientService.collection()
    .then(res => {
      this.clientArray = res;
    });
  }

  getChecks(): void {
    this._checkService.collection()
    .then(res => {
      this.checkArray = res;
    });
  }

  onSubmit(): void {
    const form = this.checkForm;

    let check = new Check();
    check.populate(form.value);

    this.persiste(check);
  }

  persiste(check: Check) {

    if(this.checkSelected) {
      check.id = this.checkSelected.id;
    }

    if(!this.checkSelected) {
      check.id = this.checkArray.length + 1;
      this.checkArray.push(check);
    }else{
      const item = this.checkArray.find(item => {
        return item.id === this.checkSelected.id;
      });
      const index = this.checkArray.indexOf(item);
      this.checkArray[index] = check;
    }

    this.closeModal();        

  }

  closeModal() {
    this.checkSelected = null;
    this.checkForm.reset();

    $('#check-modal').modal('hide');
  }

  update(check: Check) {
    this.checkSelected = check;
    this.checkForm.reset(check);
    $('#check-modal').modal();
  }

  remove(check: Check) {

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
      const index = this.checkArray.indexOf(check);
      this.checkArray.splice(index, 1);
    }, 
    (cancel) => {}
    );

  }

}
