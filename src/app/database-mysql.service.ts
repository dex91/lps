import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Question, QuestionPool, Answer } from './dateninterfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseMysqlService {

  apiRoot: String = "https://api.visualnetworks.eu/lps";
  constructor(private apiClient: HttpClient) { }

  getAllQuestions(): Observable<Question[]> {
    return this.apiClient.get<Question[]>(`${this.apiRoot}/getQuestions`);
  }

  getQuestionById(id: Number): Observable<Question> {
    return this.apiClient.get<Question>(`${this.apiRoot}/getQuestionById?id=${id}`);
  }

  getAnswerById(id: Number): Observable<Answer> {
    return this.apiClient.get<Answer>(`${this.apiRoot}/getAnswerById?id=${id}`);
  }
}
