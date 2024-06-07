import { Component, Input, OnInit } from '@angular/core';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
  @Input() topic: any;
  user: any;
  constructor(private forumService: ForumService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  deleteComment(topic: any) {
    this.forumService
      .deleteComment(this.forumService.topicId, topic.id)
      .subscribe(() => {
        topic.removed = true;
      });
  }

  reply(event: any, comment: any) {
    const body = {
      author: this.user,
      body: event.target.value,
    };

    this.forumService
      .addReply(this.forumService.topicId, parseInt(comment.id), body)
      .subscribe();
  }
}
