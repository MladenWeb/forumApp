import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ForumService, PERMISSIONS } from '../../forum.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  roles: any[] = [];
  user: any;
  selectedRole: any;
  rights: any;
  userPermissions: { [key: string]: boolean } = {};
  permissions: any = PERMISSIONS;
  roleUsers: any[] = [];
  otherUsers: any[] = [];
  allUsers: any[] = [];
  draggedUser: any;
  sortValue: string = 'name';
  roleForm!: FormGroup;
  animation: boolean = false;
  msg: string = '';

  @Output() roleChanged = new EventEmitter<number>();

  constructor(
    private forumService: ForumService,
    private cdRef: ChangeDetectorRef
  ) {}

  drop(event: CdkDragDrop<string[]>) {
    let droppedUser: any = event.previousContainer.data[event.previousIndex];
    this.forumService
      .updateUserRole(droppedUser.id, { role: this.selectedRole.id })
      .subscribe();
    this.allUsers[event.currentIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropOther(event: CdkDragDrop<string[]>) {
    let droppedUser: any = event.previousContainer.data[event.previousIndex];
    this.forumService.updateUserRole(droppedUser.id, { role: '' }).subscribe();
    this.allUsers[event.currentIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnChanges(changes: any) {
    if (changes.roleId) {
      this.fetchRoleDetails(changes.roleId.currentValue);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '');
    this.forumService.user = this.user;
    this.roleForm = new FormGroup({
      role: new FormControl('', [Validators.required]),
      right: new FormControl(null, [Validators.required]),
    });
    this.forumService.getRoles().subscribe((roles: any) => {
      this.roles = roles.data;
    });

    this.forumService.getAllUsers().subscribe((users: any) => {
      this.allUsers = users.data;
    });
  }

  setPermissions() {
    for (let key in this.permissions) {
      if (this.permissions.hasOwnProperty(key)) {
        this.userPermissions[key] =
          (this.rights & this.permissions[key]) === this.permissions[key];
      }
    }
  }

  onRoleChange(event: any) {
    this.fetchRoleDetails(event.target.value);
  }

  updateRoleSettings() {
    this.animation = false;
    this.rights = this.roleForm.value.right;
    const body = {
      name: this.roleForm.value.role,
      rights: this.roleForm.value.right,
    };
    this.forumService
      .updateRole(this.selectedRole.id, body)
      .subscribe((role) => {
        this.setPermissions();
        this.selectedRole = role.data;
        this.msg = 'Updated succesfully!';
        this.animation = true;

        this.roles.find((item: any) => item.id === this.selectedRole.id).name =
          this.selectedRole.name;
        this.roles.find(
          (item: any) => item.id === this.selectedRole.id
        ).rights = this.selectedRole.right;
      });
  }

  fetchRoleDetails(roleId: number) {
    this.forumService.getRolesById(roleId).subscribe((response: any) => {
      this.rights = response.data.rights;
      this.selectedRole = response.data;
      console.log(this.selectedRole);
      this.roleForm.patchValue({
        role: this.selectedRole.name,
        right: this.selectedRole.rights,
      });
      this.setPermissions();
      this.forumService
        .getUsersByRole(this.selectedRole.id)
        .subscribe((users: any) => {
          this.roleUsers = users.data;
          this.otherUsers = this.allUsers.filter(
            (item1) => !this.roleUsers.some((item2) => item2.id === item1.id)
          );
        });
    });
  }

  onSortChange(event: any) {
    this.sortUsers(this.roleUsers, event.target.value);
    this.sortUsers(this.otherUsers, event.target.value);
  }

  sortUsers(users: any[], sortBy: string) {
    users.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }
}
