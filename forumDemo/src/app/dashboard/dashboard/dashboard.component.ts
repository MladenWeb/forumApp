import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../forum.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit() {
    this.forumService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.data;
      },
    });
  }

  goToHomepage(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/home']);
  }
}
