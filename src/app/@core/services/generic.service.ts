import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

@Injectable()
export class GenericService {

    constructor(public http: HttpClient) {

    }

    public dashboard(): Observable<any> {
        return this.http.get(environment.baseUrl + '/api/v1/dashboard', this.getHeaders());
    }

    public quotation(): Observable<any> {
        return this.http.get('http://api.promasters.net.br/cotacao/v1/valores');
    }

    public quotation_marketwatch(): Observable<any> {
        return this.http.get('https://api.wsj.net/api/dylan/quotes/v2/comp/quoteByDialect?dialect=official&MaxInstrumentMatches=1&accept=application/json&EntitlementToken=cecc4267a0194af89ca343805a3e57af&ckey=cecc4267a0&dialects=Charting&id=Currency-US-USDBRL');
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




