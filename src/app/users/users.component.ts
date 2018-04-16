import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { TriplusClient } from '../@core/models/triplus-client.model';
import { TriplusClientService } from '../@core/services/triplus-client.service';

import { User } from '../@core/models/user.model';
import { UserService } from '../@core/services/user.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [TriplusClientService, UserService]
})

export class UserComponent implements OnInit {

  userArray: Array<User>;
  userSelected: User;
  userForm: FormGroup;
  passwordForm: FormGroup;

  clientArray: Array<TriplusClient>;

  pageView: string;

  constructor(
    public _clientService: TriplusClientService,
    public _userService: UserService,
    public builder: FormBuilder, 
    ) {
    this.pageView = 'list';

    this.userForm = builder.group({
      name: '',
      email: '',
      password: '',
      level: '',
      role: '',
      client_id: ''
    })

    this.passwordForm = builder.group({
      password: ''
    })
  }

  ngOnInit() {
    this.getClients();
  }

  getUsers(): void {
    this._userService.collection()
    .then(res => {
      this.userArray = res;
      for(let user of this.userArray) {
        user.client = this.clientArray.find(client => {
          return client.id === user.client_id
        });       
      }

    });
  }

  getClients(): void {
    this._clientService.collection().then(res => {
      this.clientArray = res;
      this.getUsers();
    });
  }

  onSubmit(): void {
    const form = this.userForm;

    let user = new User();
    user.populate(form.value);

    this.persiste(user);
  }

  onPasswordSubmit(): void {
    const form = this.passwordForm;

    swal("Sucesso", "Senha atualizada com sucesso", "success");

    this._userService.password(form.value.password, this.userSelected.id)
    .subscribe(res => {
      this.pageView = 'list';
      this.passwordForm.reset();
      console.log(res);
    });
  }

  persiste(user: User) {

    if(this.userSelected) {
      user.id = this.userSelected.id;
    }

    this._userService.persist(user).then(res => {
      if(!this.userSelected) {
        this.userArray.push(res);
      }else{
        const item = this.userArray.find(item => {
          return item.id === this.userSelected.id;
        });
        const index = this.userArray.indexOf(item);
        this.userArray[index] = user;
      }
      this.closeModal();        
    });

  }

  showModal() {
    this.pageView = 'form';
  }

  closeModal() {
    this.userSelected = null;
    this.userForm.reset();

    this.pageView = 'list';
  }

  update(user: User) {
    this.userSelected = user;
    this.userForm.reset(user);
    this.showModal();
  }

  updatePassword(user: User) {
    this.userSelected = user;
    this.pageView = 'password';
  }

  remove(user: User) {

    swal({
      title: 'Você quer remover esse usuário?',
      text: 'Você não poderá reverter essa ação depois que confirmar',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(
    (result) => {
      const index = this.userArray.indexOf(user);
      this.userArray.splice(index, 1);

      this._userService.delete(user.id).subscribe(res => {
        console.log(res);
      });
    }, 
    (cancel) => {}
    );

  }

}
