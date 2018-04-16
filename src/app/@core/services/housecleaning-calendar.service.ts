import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

import { HouseCleaningCalendar} from '../models/housecleaning-calendar.model';

@Injectable()
export class HouseCleaningCalendarService {

  constructor(public http: HttpClient) {

  }

  public collection(): Promise<Array<HouseCleaningCalendar>> {
    let arrayModel: HouseCleaningCalendar[] = [];
    return new Promise<Array<HouseCleaningCalendar>>((resolve, reject) => {
      this.fetchAll().subscribe(res => {
        for(let i of res.data) {
          let calendar = new HouseCleaningCalendar;
          calendar.populate(i);
          arrayModel.push(calendar);    
        }
        resolve(arrayModel);
      }, err => {
        reject(err);
      });
    });
  }

  public persist(calendar: HouseCleaningCalendar): Promise<HouseCleaningCalendar> {
    return new Promise<HouseCleaningCalendar>((resolve, reject) => {
      if(calendar.id) {
        this.update(calendar).subscribe(
          res => {
            let calendar = new HouseCleaningCalendar();
            calendar.populate(res);
            resolve(calendar);
          }, err => {
            reject(err);
          }
          );
      }else{
        this.create(calendar).subscribe(
          res => {
            let calendar = new HouseCleaningCalendar();
            calendar.populate(res);
            resolve(calendar);
          }, err => {
            reject(err);
          }
          );                
      }
    });
  }

  public create(calendar: HouseCleaningCalendar): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/housecleaning/calendar', calendar, this.getHeaders());
  }

  public update(calendar: HouseCleaningCalendar): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/housecleaning/calendar/' + calendar.id, calendar, this.getHeaders());
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(environment.baseUrl + '/api/v1/housecleaning/calendar/' + id, this.getHeaders());
  }

  public fetchAll(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/housecleaning/calendar', this.getHeaders());
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

