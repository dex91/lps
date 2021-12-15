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

  frageSelectiert: Boolean = false;
  questions: Question[] = [];
  pool: QuestionPool[] = [];
  selectedQuestion?: Question;
  poolSelected: Boolean = false;

  answerByQuestion: Answer = { id: 0, answers: [] };

  selectedPool: QuestionPool = { id: 0, poolURIName: "", poolName: ""};

  poolURIName: String = "";
  questionURIid: Number = 0;

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
              this.getPoolByURIName(this.poolURIName);
              this.createQuestionList(this.selectedPool.id);

              if(this.frageSelectiert)
              {
                console.log(this.questionURIid);
                this.getQuestionById(this.questionURIid);
                this.getAnswerById(this.questionURIid);
              }
            }
          }

        }
    });

    }

   /**
    * Beim Start dieser Komponente den Fragenpool laden zum auswählen....
    */

  ngOnInit(): void {
   }

   createQuestionList(id: Number) {
    this.db.getQuestionsByPoolId(id).subscribe(res => this.questions = res);
   }

   /**
    * Service aufrufen um einen Fragenpool zu setzen anhand der Übergebenen URL bzw des URINamens.
    * @param uri String in der Datenbank vom Pool
    */
    getPoolByURIName(uri: String) {
      this.db.getPoolByURIName(uri).subscribe(res => this.selectedPool = res);
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
