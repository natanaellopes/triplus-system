export class User {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public level: string;
    public role: string;
    public client_id: number;
    public client: any;

    populate(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.level = data.level;
        this.role = data.role;
        this.client_id = data.client_id;
    }
}