import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

import { AuthService } from '../../@core/services/auth.service';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    providers: [AuthService]
})

export class LoginComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    public form: FormGroup;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        private element: ElementRef, 
        public formBuilder: FormBuilder,
        public _authService: AuthService,
        private router: Router
    ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        if(localStorage.getItem('triplus_token')) {
            router.navigate(['dashboard']);
        }

        this.form = this.formBuilder.group({
          username: '',
          password: ''
        });
    }

    onSubmit(): void {
        const values = this.form.value;
        this._authService.authenticate(values.username, values.password)
          .subscribe(
            res => {
                localStorage.setItem('triplus_token', res.token_type + ' ' + res.access_token);
                let decodeToken = this.jwtHelper.decodeToken(res.access_token);
                localStorage.setItem('triplus_loggedUser', JSON.stringify(decodeToken.user));
                this.router.navigate(['dashboard']);
            },
            err => {
                swal({
                    title: 'Usuário e/ou senha incorretos',
                    text: 'Verifique os dados e tente novamente!',
                    type: 'error',
                    confirmButtonClass: 'btn btn-success',
                });
            });
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}
