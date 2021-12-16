import { Component, OnInit } from '@angular/core';
import { Answer, Question, QuestionPool } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'lps-start',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})

export class LearningComponent implements OnInit {

  // Objekte als ARRAY (zum iterrieren)
  questions: Question[] = [];
  pool: QuestionPool[] = [];

  // Prüfvariablen für das Front-end
  poolSelected: Boolean = false;
  frageSelectiert: Boolean = false;

  // Einzelne Objekte
  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };
  selectedPool: QuestionPool = { id: 0, poolURIName: "", poolName: ""};

  // Nützliche Helferlein
  poolURIName: String = "";
  questionURIid: Number = 0;

  /**
   * Router-event abonnieren und anhand des "NavigationEnd" Status den Lernmodus aufbauen.
   * @param route Object der Aktuellen Route (Klassenaufruf)
   * @param router Object des kompletten Routers (Klassenaufruf)
   * @param db Object unseres Services für die API und dessen Verbindung zum MySQL-Backend (Klassenaufruf)
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseMysqlService,
    ) {

      this.router.events.subscribe((event: Event) => {

        if (event instanceof NavigationEnd) {
          this.poolURIName = String(this.route.snapshot.paramMap.get("poolURIName"));
          this.questionURIid = Number(this.route.snapshot.paramMap.get("questionId"));

          if(this.poolURIName !== 'null') { this.poolSelected = true; }
          if(this.questionURIid !== 0) { this.poolSelected = true; this.frageSelectiert = true; }

          if(this.router.url === "/learning")
          {
          this.db.getPool().subscribe(res => this.pool = res);
          }
          else
          {
            if(this.poolSelected)
            {
              this.createQuestionListByPoolURIName(this.poolURIName);

              if(this.frageSelectiert)
              {
                this.getQuestionById(this.questionURIid);
                this.getAnswerById(this.questionURIid);
              }
            }
          }

        }
    });

    }

  ngOnInit(): void {

   }
   /**
    * Service aufrufen um die Liste an Fragen als Observable zurück zu bekommen anhand der ID des Fragenpools.
    * @param id Eindeutige Nummer des Fragenpools in der Datenbank
    */
   createQuestionList(id: Number) {
    this.db.getQuestionsByPoolId(id).subscribe(res => this.questions = res);
   }

   /**
    * Service aufrufen um genau einen Fragenpool anhand eines Snapshots (parameter der URL) aus der Datenbank zu holen.
    * @param uri Short-name (bsp.: LPIC-01) des Fragenpools.
    */
   createQuestionListByPoolURIName(uri: String) {
    this.db.getPoolByURIName(uri).subscribe(res =>
      {
        this.selectedPool = res;
        this.createQuestionList(res.id);
      }
      );
   }

   /**
    * Service aufrufen um eine Frage anhand der Übergebenen ID aufzurufen.
    * @param id Eindeutige Nummer der Frage in der Datenbank
    */
   getQuestionById(id: Number) {
    this.db.getQuestionById(id).subscribe(res => this.selectedQuestion = res);
   }

   /**
    * Service aufrufen um eine Antwort anhand der Übergebenen ID aufzurufen.
    * @param id Eindeutige Nummer der Antwort in der Datenbank
    */
   getAnswerById(id: Number) {
    this.db.getAnswerById(id).subscribe(res => this.answerByQuestion = res);
   }

  /**
    * Da das Datum als UNIX-Timestamp aus der Datenbank kommt müssen wir daraus ein Date-Objekt machen.
    * @param timestamp Der UNIX-Timestamp zum umwandeln (TYP muss any sein auch wenn im Interface Number angegeben ist!!!!!!)
    * @return Ein Date-Object für javaScript/TypeScript
    */
   formatDate(timestamp: any){
      return new Date(timestamp * 1000);
   }
}
