import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../@core/models/client.model';
import { ClientsService } from '../@core/services/clients.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  providers: [ClientsService]
})

export class ClientsComponent implements OnInit {

  clientArray: Array<Client>;
  clientSelected: Client;
  clientForm: FormGroup;

  constructor(
    public _clientService: ClientsService,
    public builder: FormBuilder, 
    ) {
    this.clientForm = builder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getClients();
  }

  getClients(): void {
    this._clientService.collection().then(res => {
      this.clientArray = res;
    });
  }

  onSubmit(): void {
    const form = this.clientForm;

    let client = new Client();
    client.populate(form.value);

    this.persiste(client);
  }

  persiste(client: Client) {

    if(this.clientSelected) {
      client.id = this.clientSelected.id;
    }

    if(!this.clientSelected) {
      client.id = this.clientArray.length + 1;
      this.clientArray.push(client);
    }else{
      const item = this.clientArray.find(item => {
        return item.id === this.clientSelected.id;
      });
      const index = this.clientArray.indexOf(item);
      this.clientArray[index] = client;
    }

    this.closeModal();        

  }

  closeModal() {
    this.clientSelected = null;
    this.clientForm.reset();

    $('#client-modal').modal('hide');
  }

  update(client: Client) {
    this.clientSelected = client;
    this.clientForm.reset(client);
    $('#client-modal').modal();
  }

  remove(client: Client) {

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
      const index = this.clientArray.indexOf(client);
      this.clientArray.splice(index, 1);
    }, 
    (cancel) => {}
    );

  }

}
