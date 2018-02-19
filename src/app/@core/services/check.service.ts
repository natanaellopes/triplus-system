import { Injectable } from '@angular/core';

import { Client } from '../models/client.model';
import { Check } from '../models/check.model';

@Injectable()
export class CheckService {
    public collection(): Promise<Array<Check>> {
        return new Promise<Array<Check>>((resolve, reject) => {
            resolve(this.getMockup());
        });
    }

    getMockup(): Array<Check> {
        let checkArray = [];

        const client = new Client();
        client.populate({
            id: 1,
            name: 'John Carter',
            email: 'johncarter@gmail.com',
            phone: '61 9999-9999'
        });

        const check = new Check();
        check.populate({
            id: 1,
            date: new Date().toISOString(),
            client_id: 1,
            client: client,
            bank: {code: '0001', name: 'Banco do Brasil'},
            agency: '12345',
            account: '123456-1',
            amount: 100,
            notes: ''
        });
        checkArray.push(check);
        
        return checkArray;
    }

}