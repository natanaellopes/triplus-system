import { HouseCleaningClient as Client } from '../models/housecleaning-client.model';

export class HouseCleaningCalendar {
    public id: number;
    public housecleaning_client_id: number;
    public housecleaning_client: Client;
    public start: string;
    public end: string;

    populate(data: any) {
        this.id = data.id;
        this.housecleaning_client_id = data.housecleaning_client_id;
        this.start = data.start;
        this.end = data.end;
    }
}