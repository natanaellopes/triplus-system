import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import filestack from 'filestack-js';

import { Client } from '../@core/models/client.model';
import { ClientsService } from '../@core/services/clients.service';

import { Deal } from '../@core/models/deal.model';
import { DealService } from '../@core/services/deal.service';

import "rxjs/add/operator/distinctUntilChanged";  
import "rxjs/add/operator/debounceTime";

const apikey = 'AABcNPAY1SNemaJ44dH6Xz';
const filestackClient = filestack.init(apikey);

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  providers: [ClientsService, DealService]
})

export class ClientsComponent implements OnInit {
  search = new FormControl();

  clientArray: Array<Client>;
  clientNoFilterArray: Array<Client>;
  clientSelected: Client;
  clientForm: FormGroup;

  dealArray: Array<Deal>;

  pageView: string;

  constructor(
    public _clientService: ClientsService,
    public _dealService: DealService,
    public builder: FormBuilder, 
    ) {
    this.pageView = 'list';

    this.search.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((title: string) => {
        this.clientArray = this.clientNoFilterArray.filter( item => 
          item.name.toLowerCase().indexOf(title.toLowerCase()) > -1 
        );
      });

    this.clientForm = builder.group({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      address: builder.group({
        zip_code: '',
        state: '',
        city: '',
        street: '',
        number: ''
      }),
      company: '',
      role: '',
      photo: '',
      reference: '',
      notes: '',
    })
  }

  ngOnInit() {
    this.getClients();
  }

  getClients(): void {
    this._clientService.collection().then(res => {
      this.clientArray = res;
      this.clientNoFilterArray = res;
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

  info(client: Client) {
    this.clientSelected = client;
    this.pageView = 'info';

    this.getDeals();
  }

  getDeals(): void {
    this._dealService.collection()
    .then(res => {
      this.dealArray = res.filter(item => 
        item.customer_id === this.clientSelected.id
      );
    });
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

  showFilePicker(client: Client) {
    const component = this;
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
      this.clientSelected = client;
      this.clientSelected.photo = res.filesUploaded[0].url;
      this.persiste(this.clientSelected);
    });
  }

}
