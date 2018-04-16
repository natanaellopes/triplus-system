import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

    constructor(public http: HttpClient) {

    }

    public authenticate(email: string, password: string): Observable<any> {
        return this.http.post(environment.baseUrl + '/api/v1/token', {email: email, password: password});
    }

}

  
