import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';

@Injectable()
export class ClientsService {
    public collection(): Promise<Array<Client>> {
        return new Promise<Array<Client>>((resolve, reject) => {
            resolve(this.getMockup());
        });
    }

    getMockup(): Array<Client> {
        let clientArray = [];

        const clientA = new Client();
        clientA.populate({
            id: 1,
            name: 'Joe Doe',
            email: 'joedoe@gmail.com',
            phone: '61 9999-9999'
        });
        clientArray.push(clientA);
        
        const clientB = new Client();
        clientB.populate({
            id: 2,
            name: 'John Carter',
            email: 'johncarter@gmail.com',
            phone: '61 9999-9999'
        });
        clientArray.push(clientB);
        
        const clientC = new Client();
        clientC.populate({
            id: 3,
            name: 'Bryan Rock',
            email: 'bryanrock@gmail.com',
            phone: '61 9999-9999'
        });
        clientArray.push(clientC);
        
        const clientD = new Client();
        clientD.populate({
            id: 4,
            name: 'Raph Carter',
            email: 'raph@gmail.com',
            phone: '61 9999-9999'
        });
        clientArray.push(clientD);
        
        return clientArray;
    }

}