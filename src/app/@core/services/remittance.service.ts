import { Injectable } from '@angular/core';
import { Remittance } from '../models/remittance.model';

@Injectable()
export class RemittanceService {
    public collection(): Promise<Array<Remittance>> {
        return new Promise<Array<Remittance>>((resolve, reject) => {
            resolve(this.getMockup());
        });
    }

    getMockup(): Array<Remittance> {
        let RemittanceArray = [];

        const RemittanceA = new Remittance();
        RemittanceArray.push(RemittanceA);
        
        const RemittanceB = new Remittance();
        RemittanceArray.push(RemittanceB);
        
        const RemittanceC = new Remittance();
        RemittanceArray.push(RemittanceC);
        
        return RemittanceArray;
    }

}