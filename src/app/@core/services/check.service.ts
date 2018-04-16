import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

import { Check } from '../models/check.model';

@Injectable()
export class CheckService {

  constructor(public http: HttpClient) {

  }

  public collection(): Promise<Array<Check>> {
    let arrayModel: Check[] = [];
    return new Promise<Array<Check>>((resolve, reject) => {
      this.fetchAll().subscribe(res => {
        for(let i of res.data) {
          let check = new Check;
          check.populate(i);
          arrayModel.push(check);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public activeCollection(): Promise<Array<Check>> {
    let arrayModel: Check[] = [];
    return new Promise<Array<Check>>((resolve, reject) => {
      this.actives().subscribe(res => {
        for(let i of res.data) {
          let check = new Check;
          check.populate(i);
          arrayModel.push(check);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public persist(check: Check): Promise<Check> {
    return new Promise<Check>((resolve, reject) => {
      if(check.id) {
        this.update(check).subscribe(
          res => {
            let check = new Check();
            check.populate(res);
            resolve(check);
          }, err => {
            reject(err);
          }
          );
      }else{
        this.create(check).subscribe(
          res => {
            let check = new Check();
            check.populate(res);
            resolve(check);
          }, err => {
            reject(err);
          }
          );                
      }
    });
  }

  public create(check: Check): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/checks', check, this.getHeaders());
  }

  public update(check: Check): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/checks/' + check.id, check, this.getHeaders());
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + '/api/v1/checks/' + id, this.getHeaders());
  }

  public actives(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/checks/actives', this.getHeaders());
  }

  public fetchAll(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/checks', this.getHeaders());
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

