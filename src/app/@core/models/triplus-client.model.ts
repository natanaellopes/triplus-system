export class TriplusClient {
    public id: number;
    public name: string;
    public resources: string;

    populate(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.resources = data.resources;
    }
}