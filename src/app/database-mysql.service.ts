import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Question, QuestionRAW, QuestionPool, Answer, Modus } from './dateninterfaces';
import { formatDateninterfaces } from './format-dateninterfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseMysqlService {

  apiRoot: String = "https://api.visualnetworks.eu/lps";
  private modus?: Modus;

  constructor(
    private apiClient: HttpClient,
    ) { }

  getPools(): Observable<QuestionPool[]> {
    return this.apiClient.get<QuestionPool[]>(`${this.apiRoot}/getPools`);
  }

  getPoolByURIName(uri: String): Observable<QuestionPool> {
    let requestURI = encodeURI(`${this.apiRoot}/getPoolByURIName?poolURIName=${uri}`);
    return this.apiClient.get<QuestionPool>(requestURI);
  }

  getQuestionsByPoolId(id: Number): Observable<Question[]> {
    return this.apiClient.get<QuestionRAW[]>(`${this.apiRoot}/getQuestionsByPoolId?poolId=${id}`).pipe(
      retry(3),
      map(questionRAW => questionRAW.map(question => formatDateninterfaces.formatQuestion(question))),
      );
  }

  getQuestionById(id: Number): Observable<Question> {
    return this.apiClient.get<QuestionRAW>(`${this.apiRoot}/getQuestionById?id=${id}`).pipe(
      retry(3),
      map(question => formatDateninterfaces.formatQuestion(question)),
    );
  }

  getAnswerById(id: Number): Observable<Answer> {
    return this.apiClient.get<Answer>(`${this.apiRoot}/getAnswerById?id=${id}`);
  }

  /**
   * 3 Methoden damit sich Komponenten untereinander unterhalten können.
   * Wie "Modus" aussieht steht jetzt nur dürr fest....
   * @param modeObj Das object zum steuern von subkomponenten
   */
  setMode(modeObj: Modus): void {
    this.modus = modeObj;
  }
  getMode() {
    let temp = this.modus;
    this.clearMode();
    return temp;
  }
  clearMode(): void {
    this.modus = undefined;
  }
}
