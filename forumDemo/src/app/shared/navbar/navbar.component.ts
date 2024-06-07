import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any;
  constructor() {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }
}
