import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { HouseCleaningClient as Client } from '../@core/models/housecleaning-client.model';
import { HouseCleaningClientService as ClientsService } from '../@core/services/housecleaning-client.service';

import { Deal } from '../@core/models/deal.model';
import { DealService } from '../@core/services/deal.service';

import "rxjs/add/operator/distinctUntilChanged";  
import "rxjs/add/operator/debounceTime";

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-housecleaning-clients',
  templateUrl: './housecleaning-clients.component.html',
  styleUrls: ['./housecleaning-clients.component.css'],
  providers: [ClientsService]
})

export class HouseCleaningClientsComponent implements OnInit {
  search = new FormControl();

  clientArray: Array<Client>;
  clientSelected: Client;
  clientForm: FormGroup;
  resourcesArray: string[];

  pageView: string;

  constructor(
    public _clientService: ClientsService,
    public builder: FormBuilder, 
    ) {
    this.pageView = 'list';

    this.clientForm = builder.group({
      name: '',
      address_zip_code: '',
      address_state: '',
      address_city: '',
      address_street: '',
      address_number: '',
      nickname: '',
      price: '',
      notes: ''
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

    this._clientService.persist(client).then(res => {
      if(!this.clientSelected) {
        this.clientArray.push(res);
      }else{
        const item = this.clientArray.find(item => {
          return item.id === this.clientSelected.id;
        });
        const index = this.clientArray.indexOf(item);
        this.clientArray[index] = client;
      }
      this.closeModal();        
    });

  }

  showModal() {
    this.pageView = 'form';
  }

  closeModal() {
    this.clientSelected = null;
    this.clientForm.reset();

    this.pageView = 'list';
  }

  update(client: Client) {
    this.clientSelected = client;
    this.clientForm.reset(client);
    this.showModal();
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

      this._clientService.delete(client.id).subscribe(res => {
        console.log(res);
      });
    }, 
    (cancel) => {}
    );

  }

}
