import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService, PERMISSIONS } from '../../forum.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  rights: any;
  permissions: any = PERMISSIONS;
  userPermissions: { [key: string]: boolean } = {};
  msg: string = '';
  animation: boolean = false;

  setPermissions() {
    for (let key in this.permissions) {
      if (this.permissions.hasOwnProperty(key)) {
        this.userPermissions[key] =
          (this.rights & this.permissions[key]) === this.permissions[key];
      }
    }
  }
  user: any;
  userForm!: FormGroup;
  userId: any = null;
  commentCount = 0;
  topicCount = 0;
  role = { name: '', permissions: [] };
  totalComments: number = 0;
  topics: any;
  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
    this.forumService.user = this.user;
    this.setPermissions();
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.userForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).*'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.forumService.getUserData(this.userId).subscribe((data: any) => {
      this.userForm.patchValue({
        name: data.data.name,
        email: data.data.email,
      });
    });

    this.forumService.getUserTopics(this.userId).subscribe((item: any) => {
      this.topics = item.data;
    });
    this.forumService.getTopics().subscribe((topics: any) => {
      this.topicCount = topics.data.filter(
        (v: any) => v.author.id === parseInt(this.userId)
      ).length;

      for (let topic of topics.data) {
        if (topic.comments) {
          this.totalComments += this.countComments(topic.comments);
        }
      }
    });

    this.forumService.getUserStats(this.userId).subscribe((data: any) => {
      this.role.name = data.data.name;
      this.rights = data.data.rights;
      this.setPermissions();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  countComments(comments: any[]): any {
    let count = comments.filter(
      (v: any) => v.author.id == parseInt(this.userId)
    ).length;
    for (let comment of comments) {
      if (comment.comments && comment.comments.length > 0) {
        count += this.countComments(comment.comments);
      }
    }
    return count;
  }

  onSubmit() {
    this.forumService
      .updateUserProfile(this.userId, {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
      })
      .pipe(
        switchMap(() =>
          this.forumService.updateUserPassword(this.userId, {
            password1: this.userForm.value.password,
            password2: this.userForm.value.confirmPassword,
          })
        )
      )
      .subscribe((data) => {
        this.animation = true;
        this.msg = 'Succesfully updated!';
        this.userForm.controls['password'].reset();
        this.userForm.controls['confirmPassword'].reset();
      });
  }
}
