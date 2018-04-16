import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Rx";

import { environment } from '../../../environments/environment';

import { Deal } from '../models/deal.model';
import { Client } from '../models/client.model';
import { Check } from '../models/check.model';

@Injectable()
export class DealService {
  constructor(public http: HttpClient) {

  }

  public collection(): Promise<Array<Deal>> {
    let arrayModel: Deal[] = [];
    return new Promise<Array<Deal>>((resolve, reject) => {
      this.fetchAll().subscribe(res => {
        for(let i of res.data) {
          let deal = new Deal;
          deal.populate(i);
          arrayModel.push(deal);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public persist(deal: Deal): Promise<Deal> {
    return new Promise<Deal>((resolve, reject) => {
      if(deal.id) {
        this.update(deal).subscribe(
          res => {
            let deal = new Deal();
            deal.populate(res);
            resolve(deal);
          }, err => {
            reject(err);
          }
          );
      }else{
        this.create(deal).subscribe(
          res => {
            let deal = new Deal();
            deal.populate(res);
            resolve(deal);
          }, err => {
            reject(err);
          }
          );                
      }
    });
  }

  public create(deal: Deal): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/transactions', deal, this.getHeaders());
  }

  public update(deal: Deal): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/transactions/' + deal.id, deal, this.getHeaders());
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + '/api/v1/transactions/' + id, this.getHeaders());
  }

  public fetchAll(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/transactions', this.getHeaders());
  }

  public balance(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/balance', this.getHeaders());
  }

  public balanceByType(type: string): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/balance/type?type=' + type, this.getHeaders());
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
