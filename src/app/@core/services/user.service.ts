import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';

@Injectable()
export class UserService {

  constructor(public http: HttpClient) {

  }

  public collection(): Promise<Array<User>> {
    let arrayModel: User[] = [];
    return new Promise<Array<User>>((resolve, reject) => {
      this.fetchAll().subscribe(res => {
        for(let i of res.data) {
          let user = new User;
          user.populate(i);
          arrayModel.push(user);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public persist(user: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if(user.id) {
        this.update(user).subscribe(
          res => {
            let user = new User();
            user.populate(res);
            resolve(user);
          }, err => {
            reject(err);
          }
          );
      }else{
        this.create(user).subscribe(
          res => {
            let user = new User();
            user.populate(res);
            resolve(user);
          }, err => {
            reject(err);
          }
          );                
      }
    });
  }

  public create(user: User): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/users', user, this.getHeaders());
  }

  public update(user: User): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/users/' + user.id, user, this.getHeaders());
  }

  public password(password: string, id: number): Observable<Object> {
    return this.http.post(environment.baseUrl + '/api/v1/users/' + id + '/password', {password: password}, this.getHeaders());
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + '/api/v1/users/' + id, this.getHeaders());
  }

  public fetchAll(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/users', this.getHeaders());
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

