export class Address {

  public zip_code: string;
  public state: string;
  public city: string;
  public street: string;
  public number: string;

  populate(data: any) {
    this.zip_code = data.zip_code;
    this.state = data.state;
    this.city = data.city;
    this.street = data.street;
    this.number = data.number;
  }
}
