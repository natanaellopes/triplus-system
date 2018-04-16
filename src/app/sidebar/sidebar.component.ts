import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    resource: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/clients',
        title: 'Clientes',
        type: 'link',
        icontype: 'group',
        resource: 'clients'
    },
    {
        path: '/triplus-client',
        title: 'Clientes',
        type: 'link',
        icontype: 'group',
        resource: 'triplus-client'
    },
    {
        path: '/users',
        title: 'Usuários',
        type: 'link',
        icontype: 'group',
        resource: 'users'
    },
    {
        path: '/checks',
        title: 'Cheques',
        type: 'link',
        icontype: 'attach_money',
        resource: 'checks'
    },
    {
        path: '/deal',
        title: 'Transações',
        type: 'link',
        icontype: 'swap_horiz',
        resource: 'deal'
    },
    {
        path: '/housecleaning/client',
        title: 'Clientes',
        type: 'link',
        icontype: 'group',
        resource: 'housecleaning-client'
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public loggedUser: any;

    constructor(private router: Router) {}

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = [];
        this.menuItems.push({
            path: '/dashboard',
            title: 'Dashboard',
            type: 'link',
            icontype: 'dashboard',
            resource: 'dashboard'
        });
        this.loggedUser = JSON.parse(localStorage.getItem('triplus_loggedUser'));
        if(this.loggedUser.resources !== '') {
            let resources = this.loggedUser.resources.split(',');
            for(let res of resources) {
                this.menuItems.push(ROUTES.find(item => {
                    return item.resource === res;
                }))
            }            
        }
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['auth']);
    }
    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
