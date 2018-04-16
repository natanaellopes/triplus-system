export class HouseCleaningClient {
    public id: number;
    public name: string;

    public address_zip_code: string;
    public address_state: string;
    public address_city: string;
    public address_street: string;
    public address_number: string;

    public nickname: string;
    public price: number;

    public notes: string;

    populate(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.address_zip_code = data.address_zip_code;
        this.address_state = data.address_state;
        this.address_city = data.address_city;
        this.address_street = data.address_street;
        this.address_number = data.address_number;
        this.nickname = data.nickname;
        this.price = data.price;
        this.notes = data.notes;
    }
}