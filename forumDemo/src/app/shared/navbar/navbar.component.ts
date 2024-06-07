import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, public forumService: ForumService) {}

  ngOnInit() {}

  logout() {
    localStorage.removeItem('user');
    this.forumService.user = null;
    this.router.navigate(['/']);
  }

  navigate(url: string, id?: any) {
    id == undefined
      ? this.router.navigate([url])
      : this.router.navigate([url, this.forumService.user.id]);
  }
}
