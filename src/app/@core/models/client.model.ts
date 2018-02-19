export class Client {
    public id: number;
    public name: string;
    public email: string;
    public phone: string;

    populate(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
    }
}