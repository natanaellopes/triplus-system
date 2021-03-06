import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

import { Client } from '../models/client.model';

@Injectable()
export class ClientsService {

  constructor(public http: HttpClient) {

  }

  public collection(): Promise<Array<Client>> {
    let arrayModel: Client[] = [];
    return new Promise<Array<Client>>((resolve, reject) => {
      this.fetchAll().subscribe(res => {
        for(let i of res.data) {
          let client = new Client;
          client.populate(i);
          arrayModel.push(client);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public persist(client: Client): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
      if(client.id) {
        this.update(client).subscribe(
          res => {
            let client = new Client();
            client.populate(res);
            resolve(client);
          }, err => {
            reject(err);
          }
          );
      }else{
        this.create(client).subscribe(
          res => {
            let client = new Client();
            client.populate(res);
            resolve(client);
          }, err => {
            reject(err);
          }
          );                
      }
    });
  }

  public create(client: Client): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/customers', client, this.getHeaders());
  }

  public update(client: Client): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/customers/' + client.id, client, this.getHeaders());
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + '/api/v1/customers/' + id, this.getHeaders());
  }

  public fetchAll(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/customers', this.getHeaders());
  }

  getHeaders(): {headers: HttpHeaders} {
    const token = localStorage.getItem('triplus_token');
    const headerOptions = {
      'Authorization': token,
      'Accept': 'application/json'
    };
    return {headers: new HttpHeaders(headerOptions)};
  }

}

