export class Check {
  public id: number;
  public date: string;
  public number: number;
  public bank: string;
  public agency: string;
  public account: string;
  public amount: number;
  public emitter_name: string;
  public emitter_doc: string;
  public notes: string;
  public status: string;
  public customer_id: number;
  public customer: any;
  public selected: boolean;
  public photo: string;

  populate(data: any) {
    this.id = data.id;
    this.date = data.date;
    this.number = data.number;
    this.bank = data.bank;
    this.agency = data.agency;
    this.account = data.account;
    this.amount = data.amount;
    this.emitter_name = data.emitter_name;
    this.emitter_doc = data.emitter_doc;
    this.notes = data.notes;
    this.status = data.status;
    this.photo = data.photo;
    this.customer_id = data.customer_id;
  }
}