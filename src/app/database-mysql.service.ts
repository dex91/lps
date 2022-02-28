import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Question, QuestionRAW, QuestionPool, Answer, Modus, examValue, examTimer } from './dateninterfaces';
import { formatDateninterfaces } from './format-dateninterfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class DatabaseMysqlService {

  //protected apiRoot: String = "https://api.visualnetworks.eu/lps";
  //Changed the Server!
  protected apiRoot: String = "https://api.visualdevelopers.de/lps";
  private modus?: Modus;
  private exam?: examValue;
  private timerTick?: examTimer;

  constructor(
    private apiClient: HttpClient,
    private router: Router,
    ) { }

  APIgetPools(): Observable<QuestionPool[]> {
    return this.apiClient.get<QuestionPool[]>(`${this.apiRoot}/getPools`);
  }

  APIgetPoolByURIName(uri: String): Observable<QuestionPool> {
    let requestURI = encodeURI(`${this.apiRoot}/getPoolByURIName?poolURIName=${uri}`);
    return this.apiClient.get<QuestionPool>(requestURI);
  }

  APIgetQuestionsByPoolId(id: Number): Observable<Question[]> {
    return this.apiClient.get<QuestionRAW[]>(`${this.apiRoot}/getQuestionsByPoolId?poolId=${id}`).pipe(
      retry(3),
      map(questionRAW => questionRAW.map(question => formatDateninterfaces.formatQuestion(question))),
      );
  }

  APIgetAnswersByPoolId(id: Number): Observable<Answer[]> {

    return this.apiClient.get<Answer[]>(`${this.apiRoot}/getAnswersByPoolId?poolId=${id}`);
  }

  APIgetPruefungsQuestionsByPoolId(id: Number, questionSize: Number): Observable<Question[]> {
    return this.apiClient.get<QuestionRAW[]>(`${this.apiRoot}/getPruefungsQuestionsByPoolId.php?poolId=${id}&questionSize=${questionSize}`).pipe(
    retry(3),
    map(questionRAW => questionRAW.map(question => formatDateninterfaces.formatQuestion(question))),
    );
  }

  // Getter sowie Setter für den Modus.
  setMode(modeObj: Modus) {
    this.modus = modeObj;
  }

  getMode(): Modus {
    return this.modus || {mode: ''};
  }

  // Für unseren Prüfungstimer.. Getter sowie Setter.
  setExamTicker(modeObj: examTimer) {
    this.timerTick = modeObj;
  }

  getExamTicker(): examTimer {
    return this.timerTick || {tick: false};
  }

  // Getter sowie Setter für die Prüfungssimulation. Und weitere Funktionen
  exitExam(backToLearning?: Boolean) {
    let navigate: String = '';
    this.exam = {exit: true, warning: false};
    this.setExamTicker({tick: false});
    backToLearning ? navigate = 'learning' : navigate = 'pruefung';
    this.router.navigate([navigate]);
  }

  setExamValue(modeObj: examValue) {
    this.exam = modeObj;
  }

  getExamValue(): examValue {
    return this.exam || {};
  }

}
