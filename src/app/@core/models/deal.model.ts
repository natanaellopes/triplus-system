import { Client } from '../models/client.model';
import { Check } from '../models/check.model';

export class Deal {

  public id: number;
  public date: string;
  public time: string;
  public description: string;
  public customer_id: number;
  public check_id: number;
  public customer: Client;
  public check: Check;
  public type: string;
  public credit: number;
  public debit: number;
  public purchase_rate: number;
  public sales_charge: number;
  public transaction_type: string;
  public rate: string;

  public deal_check;
  public deal_customer;

  populate(data: any) {
    this.id = data.id;
    this.date = data.date;
    this.time = data.time;
    this.description = data.description;
    this.customer_id = data.customer_id;
    this.check_id = data.check_id;
    this.type = data.type;
    this.credit = data.credit;
    this.debit = data.debit;
    this.purchase_rate = data.purchase_rate;
    this.sales_charge = data.sales_charge;
    this.transaction_type = data.transaction_type;
    this.rate = data.rate;
  }
}