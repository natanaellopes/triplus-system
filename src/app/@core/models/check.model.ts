import { Client } from './client.model';

export class Check {
  public id: number;
  public date: string;
  public client: Client;
  public client_id: number;
  public bank: {code: string, name: string};
  public agency: string;
  public account: string;
  public amount: number;
  public notes: string;
  public status: string;

  populate(data: any) {
    this.id = data.id;
    this.date = data.date;
    this.client = data.client;
    this.client_id = data.client_id;
    this.bank = data.bank;
    this.agency = data.agency;
    this.account = data.account;
    this.amount = data.amount;
    this.notes = data.notes;
    this.status = data.status;
  }
}