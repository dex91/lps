import { Component, OnInit } from '@angular/core';
import { Question, Answer, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'lps-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  // Für die API und den Modus "globale" variablen
  questionURIid: Number = 0;
  poolURIName: String = "";
  modus?: Modus;

  // Einzelfrage (lernmodus)
  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };

  // Variablen für Teil und Prüfungsmodus
  showhelp: Boolean = false;
  answerInput: String = "";
  resetButton: Boolean = false;

  //Variablen für den Teilprüfungsmodus
  vorpruefungQuestionList: Question[] = []; // Hier mit ARRAY da wir daten zwischenspeichern müssen.
  questionIDForArray: any;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.modus = this.db.getMode();

    // Beim wechseln einer Frage sollen bestimmte Aktionen ausgeführt werden.
    // z.b Das der Hilfetext ausgeblendet wird.
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          this.showhelp = false;
          this.resetButton = false;
      }
  });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(nav =>{

      this.questionURIid = Number(nav.get('questionId'));
      this.poolURIName = String(nav.get('poolURIName'));

      this.questionIDForArray = this.questionURIid;
      this.questionIDForArray = this.questionIDForArray-1; // Direkt -1 rechnen, denn QuestionID != Array-Index!

      if(this.modus?.teilpruefung)
      {
        this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
          this.db.APIgetQuestionsByPoolId(Number(pool.id)).subscribe(qlist => this.vorpruefungQuestionList = qlist);
        });

        this.db.APIgetAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);
      }

      if(this.modus?.pruefungsmodus)
      {
        console.log("nicht implementiert");
      }

      if(this.modus?.lernmodus)
      {
        this.db.APIgetQuestionById(this.questionURIid).subscribe(res => this.selectedQuestion = res);
        this.db.APIgetAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);
      }

    });


  }

  toggleHelp() {
     return this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

  checkanswer(button: HTMLElement, answerID: any, isMultiple: Boolean, liste?: HTMLElement){

    if(this.selectedQuestion) { this.selectedQuestion.q_answered = true; }

    if(isMultiple && liste)
    {
      if(this.answerByQuestion.answers[answerID] == '1') {
        button.classList.add('class', 'border-success');
        button.setAttribute('disabled', '');
      }

      if(this.answerByQuestion.answers[answerID] == '0') {
        button.classList.add('class', 'border-danger');
        for (let i = 0; i < liste.children.length; i++) {
          liste.children[i].setAttribute('disabled', '');
        }
        this.resetButton = true;
      }
    }
    else
    {
      if(this.answerByQuestion.answers[0] == this.answerInput) { this.resetButton = true; button.classList.add('class', 'border-success'); button.setAttribute('disabled', ''); }
      if(this.answerByQuestion.answers[0] !== this.answerInput) { this.resetButton = true; button.classList.add('class', 'border-danger'); button.setAttribute('disabled', ''); }
    }

    this.vorpruefungQuestionList[this.questionIDForArray].q_answered = true;
    }

  resetQuestion(element: HTMLElement, isMultiple: Boolean){

    if(isMultiple)
    {
      for (let i = 0; i < element.children.length; i++) {
        element.children[i].removeAttribute('disabled');
        element.children[i].classList.remove('border-success');
        element.children[i].classList.remove('border-danger');
      }
    }
    else
    {
      element.removeAttribute('disabled');
      element.classList.remove('border-success');
      element.classList.remove('border-danger');
      this.answerInput = "";
    }
    this.resetButton = false;
  }
}
