import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../forum.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  topics: any[] = [];
  topicId: any;
  comment!: string;
  user: any;
  topicForm!: FormGroup;
  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
    this.forumService.user = this.user;
    this.topicForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
    this.forumService.getTopics().subscribe((topics: any) => {
      this.topics = topics.data.map((v: any) => ({
        ...v,
        comment: '',
        toggle: false,
      }));
    });
  }

  addComment(event: any, topic: any) {
    const body = {
      author: this.user,
      body: event.target.value,
    };
    if (event?.target.value) {
      this.forumService
        .addTopicComment(topic.id, body)
        .subscribe((response: any) => {
          topic.comments.push(response.data);
          topic.comment = '';
        });
    }
  }

  goToProfile() {
    this.router.navigate(['/user', this.user.id]);
  }

  goToAdminPage() {
    this.router.navigate(['/admin']);
  }

  toggleTopic(topic: any) {
    this.topics.forEach((element) => {
      if (element !== topic) {
        element.toggle = false;
      }
    });
    topic.toggle = !topic.toggle;
    this.forumService.topicId = topic.id;
  }

  addTopic() {
    const body = {
      author: this.user,
      body: this.topicForm.value.description,
      title: this.topicForm.value.name,
    };
    this.forumService.addTopic(body).subscribe((topic: any) => {
      this.topics.push(topic.data);
      this.topicForm.reset();
    });
  }

  deleteTopic(topic: any) {
    this.forumService.deleteTopic(topic.id).subscribe(() => {
      this.topics = this.topics.filter((item: any) => item.id !== topic.id);
    });
  }
}
