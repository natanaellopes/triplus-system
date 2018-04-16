import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { TriplusClient as Client } from '../@core/models/triplus-client.model';
import { TriplusClientService as ClientsService } from '../@core/services/triplus-client.service';

import { Deal } from '../@core/models/deal.model';
import { DealService } from '../@core/services/deal.service';

import "rxjs/add/operator/distinctUntilChanged";  
import "rxjs/add/operator/debounceTime";

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-triplus-clients',
  templateUrl: './triplus-clients.component.html',
  styleUrls: ['./triplus-clients.component.css'],
  providers: [ClientsService]
})

export class TriplusClientsComponent implements OnInit {
  search = new FormControl();

  clientArray: Array<Client>;
  clientSelected: Client;
  clientForm: FormGroup;
  resourcesArray: string[];

  pageView: string;

  resourcesForm = [
    {
        title: 'Clientes',
        resource: 'clients'
    },
    {
        title: 'Clientes Triplus',
        resource: 'triplus-client'
    },
    {
        title: 'Usuários',
        resource: 'users'
    },
    {
        title: 'Cheques',
        resource: 'checks'
    },
    {
        title: 'Transações',
        resource: 'deal'
    },
    {
        title: 'Clientes (House Cleaning)',
        resource: 'housecleaning-client'
    }
  ];

  constructor(
    public _clientService: ClientsService,
    public builder: FormBuilder, 
    ) {
    this.pageView = 'list';

    this.clientForm = builder.group({
      name: ''
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

  resources(client: Client) {
    this.clientSelected = client;
    this.resourcesArray = client.resources.split(',');
    this.pageView = 'resources-form';
  }

  onResourcesSubmit() {

    swal("Sucesso", "Recursos atualizados com sucesso!", "success");

    this._clientService.resources(this.resourcesArray.join(','), this.clientSelected.id)
    .subscribe(res => {
      this.resourcesArray = [];
      this.clientSelected = null;
      this.pageView = 'list';
    });
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
