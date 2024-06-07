import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export let PERMISSIONS = {
  READ_COMMENTS: 1,
  ADD_DELETE_COMMENTS: 2,
  ADD_DELETE_TOPICS: 4,
  DELETE_OTHERS_CONTENT: 8,
};
@Injectable({
  providedIn: 'root',
})
export class ForumService {
  public apiUrl = 'http://localhost:8888/api/';
  topicId!: number;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl + 'users');
  }

  getUsersByRole(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}role/${id}/users`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}roles`);
  }

  getRolesById(roleId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}role/${roleId}`);
  }

  deleteComment(topicId: number, commentId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}topic/${topicId}/comment/${commentId}`
    );
  }
  addTopic(body: any): Observable<any> {
    return this.http.post(this.apiUrl + 'topic/add', body);
  }

  addTopicComment(id: string, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}topic/${id}/comment/add`, body);
  }

  addReply(topicId: number, commentId: number, body: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}topic/${topicId}/comment/${commentId}/add`,
      body
    );
  }

  deleteTopic(topicId: any): Observable<any> {
    return this.http.delete(this.apiUrl + 'topic/' + topicId);
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user`, data);
  }

  updateUserRole(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user/${userId}`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/password`, data);
  }

  getUserData(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getUserStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}role/${userId}`);
  }
  getTopics(): Observable<any> {
    return this.http.get(`${this.apiUrl}topics`);
  }

  getUserTopics(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}topic/${userId}`);
  }

  updateUserProfile(userId: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user/${userId}`, body);
  }

  updateRole(roleId: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}role/${roleId}`, body);
  }

  updateUserPassword(userId: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user/${userId}/password`, {
      password1: body.password1,
      password2: body.password2,
    });
  }
}
