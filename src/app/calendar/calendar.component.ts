import { Component, OnInit } from '@angular/core';

import { HouseCleaningClient as Client } from '../@core/models/housecleaning-client.model';
import { HouseCleaningClientService as ClientsService } from '../@core/services/housecleaning-client.service';

import { HouseCleaningCalendar } from '../@core/models/housecleaning-calendar.model';
import { HouseCleaningCalendarService } from '../@core/services/housecleaning-calendar.service';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'app-calendar-cmp',
    templateUrl: 'calendar.component.html',
    providers: [ClientsService, HouseCleaningCalendarService]
})

export class CalendarComponent implements OnInit {

    public clientArray: Array<Client>;
    public calendarArray: Array<HouseCleaningCalendar>;
    public eventArray: Array<any>;
    public colors: Array<string>;

    constructor(
        private _clientsService: ClientsService,
        private _houseCleaningCalendarService: HouseCleaningCalendarService
    ) {

    }

    getClients() {
        this._clientsService.collection().then(res => {
            this.clientArray = res;
            this.getCalendar();
        });
    }

    getCalendar() {
        this._houseCleaningCalendarService.collection().then(res => {
            this.calendarArray = res;
            this.eventArray = [];
            this.calendarArray.map(item => {
                item.housecleaning_client = this.clientArray.find(client => client.id === item.housecleaning_client_id);
                this.eventArray.push({
                    id: item.id,
                    housecleaning_client_id: item.housecleaning_client_id,
                    title: item.housecleaning_client.name,
                    start: item.start,
                    end: item.end,
                    className: this.colors[item.housecleaning_client_id]
                })
            });
            this.renderCalendar();
        });
    }

    generateColors() {
        let color = ['event-blue', 'event-azure', 'event-green', 'event-orange', 'event-red'];
        this.colors = [];
        for(let i=0;i<10;i++) {
            this.colors.push(...color);
        }
    }

    ngOnInit() {
       this.generateColors();
       this.getClients();
    }

    renderCalendar() {
         const $calendar = $('#fullCalendar');

        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();

        const _this = this;

        $calendar.fullCalendar({
            header: {
                center: 'title',
                right: 'listWeek, agendaWeek, agendaDay',
                left: 'prev, next, today'
            },
            defaultView: 'agendaWeek',
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            allDaySlot: false,
            views: {
                month: {
                    titleFormat: 'MMMM YYYY'
                },
                week: {
                    titleFormat: ' MMMM D YYYY'
                },
                day: {
                    titleFormat: 'D MMM, YYYY'
                }
            },

            select: function(start: any, end: any) {

                let html = "";
                html += '<div class="form-group">';

                html += '<label>Cliente</label>'
                html += '<select id="input-client" class="form-control">';

                for(let client of _this.clientArray) {
                    html += "<option value='" + JSON.stringify(client) + "'>" + client.name + "</option>";
                }

                html += '</select>'

                html += '</div>';

                swal({
                    title: 'Create an Event',
                    html: html,
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function(result: any) {

                    let eventData;
                    const event_title_string = $('#input-client').val();
                    const event_title_obj = JSON.parse(event_title_string);

                    if (event_title_string) {
                        let calendar = new HouseCleaningCalendar;
                        calendar.populate({
                            housecleaning_client_id: event_title_obj.id,
                            start: start.format("YYYY-MM-DD HH:mm:ss"),
                            end: end.format("YYYY-MM-DD HH:mm:ss")
                        });
                        _this._houseCleaningCalendarService.create(calendar).subscribe(res => {
                            eventData = {
                                id: res.id,
                                housecleaning_client_id: event_title_obj.id,
                                title: event_title_obj.name,
                                start: start,
                                end: end
                            };
                            $calendar.fullCalendar('renderEvent', eventData, true);
                        });

                    }

                    $calendar.fullCalendar('unselect');

                });
            },
            eventResize: function(event, delta, revertFunc) {
                let calendar = new HouseCleaningCalendar;
                calendar.populate({
                    id: event.id,
                    housecleaning_client_id: event.housecleaning_client_id,
                    start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                    end: event.end.format("YYYY-MM-DD HH:mm:ss")
                });
                _this._houseCleaningCalendarService.update(calendar).subscribe(res => {
                    console.log(res);
                });
            },
            eventClick: function(calEvent, jsEvent, view) {
                let html = "";
                html += '<div class="form-group">';

                html += '<label>Cliente</label>'
                html += '<select id="input-client" class="form-control">';

                for(let client of _this.clientArray) {
                    html += "<option value='" + JSON.stringify(client) + "'>" + client.name + "</option>";
                }

                html += '</select>'

                html += '</div>';

                swal({
                    title: 'Update Event',
                    html: html,
                    confirmButtonClass: 'btn btn-success'
                }).then(function(result: any) {

                    let eventData;
                    const event_title_string = $('#input-client').val();
                    const event_title_obj = JSON.parse(event_title_string);

                    if (event_title_string) {
                        let calendar = new HouseCleaningCalendar;
                        calendar.populate({
                            id: calEvent.id,
                            housecleaning_client_id: event_title_obj.id,
                            start: calEvent.start.format("YYYY-MM-DD HH:mm:ss"),
                            end: calEvent.end.format("YYYY-MM-DD HH:mm:ss")
                        });
                        _this._houseCleaningCalendarService.update(calendar).subscribe(res => {
                            console.log(res)
                        });

                    }

                    $calendar.fullCalendar('unselect');

                });
            },
            eventDrop: function(event, jsEvent, view) {
                let calendar = new HouseCleaningCalendar;
                calendar.populate({
                    id: event.id,
                    housecleaning_client_id: event.housecleaning_client_id,
                    start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                    end: event.end.format("YYYY-MM-DD HH:mm:ss")
                });
                _this._houseCleaningCalendarService.update(calendar).subscribe(res => {
                    console.log(res);
                });
            },
            editable: true,
            eventLimit: true,
            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
            events: this.eventArray
        });
    }

}
