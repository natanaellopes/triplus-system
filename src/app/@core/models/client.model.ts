import { Address } from './address.model';

export class Client {
    public id: number;
    public name: string;
    public lastname: string;
    public email: string;
    public phone: string;
    public address: Address;
    public company: string;
    public role: string;
    public photo: string;
    public reference: number;
    public notes: string;

    populate(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.lastname = data.lastname;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.company = data.company;
        this.role = data.role;
        this.photo = data.photo;
        this.reference = data.reference;
        this.notes = data.notes;
    }
}