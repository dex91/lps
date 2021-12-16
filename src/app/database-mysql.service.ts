import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Question, QuestionPool, Answer } from './dateninterfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseMysqlService {

  apiRoot: String = "https://api.visualnetworks.eu/lps";
  constructor(
    private apiClient: HttpClient,
    ) { }

  getAllQuestions(): Observable<Question[]> {
    return this.apiClient.get<Question[]>(`${this.apiRoot}/getQuestions`);
  }

  getPool(): Observable<QuestionPool[]> {
    return this.apiClient.get<QuestionPool[]>(`${this.apiRoot}/getPools`);
  }

  getPoolByURIName(uri: String): Observable<QuestionPool> {
    let requestURI = encodeURI(`${this.apiRoot}/getPoolByURIName?poolURIName=${uri}`);
    return this.apiClient.get<QuestionPool>(requestURI);
  }

  getQuestionById(id: Number): Observable<Question> {
    return this.apiClient.get<Question>(`${this.apiRoot}/getQuestionById?id=${id}`);
  }

  getAnswerById(id: Number): Observable<Answer> {
    return this.apiClient.get<Answer>(`${this.apiRoot}/getAnswerById?id=${id}`);
  }

  getQuestionsByPoolId(id: Number): Observable<Question[]> {
    return this.apiClient.get<Question[]>(`${this.apiRoot}/getQuestionsByPoolId?poolId=${id}`);
  }
}
