import { Component, OnInit } from '@angular/core';
import { Question, Answer, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, NavigationStart, Router, Event, NavigationEnd } from '@angular/router';

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
  answersByUser: Answer[] = [];
  answersByQuestion: Answer[] = [];

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
    // z.b Das der Resetbutton verschwindet (da das laden der Frage anders von statten gehen soll)
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
        if(this.vorpruefungQuestionList.length == 0) {
          this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
            this.db.APIgetQuestionsByPoolId(Number(pool.id)).subscribe(qlist => this.vorpruefungQuestionList = qlist);
          });
        }
        this.db.APIgetAnswerById(this.questionURIid).subscribe(answer => this.answerByQuestion = answer);

        // Fragen laden (vorher formular entsperren)
        setTimeout(() => {
          this.answerByQuestion.answers.forEach((element, z) => document.getElementById(`answerButton_${z}`)?.classList.remove('disabled'));
          this.answersByUser.forEach((element, i) =>
          {
            if(this.answerByQuestion.id == this.answersByUser[i].id)
            {
              this.resetButton = true;
              this.answersByUser[i].answers.forEach((element, y) =>
              {
                let btntoChange = document.getElementById(`answerButton_${y}`);
                if(this.answersByUser[i].answers[y] == '1')
                {
                  btntoChange?.classList.add('border-warning');
                }
              });
            }
          });
        },150);

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

  returnAnswer(){

  }

  toggleHelp() {
     return this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

  checkanswer(button: HTMLElement, answerID: any, isMultiple: Boolean, modus: String, liste?: HTMLElement){

    // Variablen für Antwortobjekt
    let buttonAnswerArray: Array<String> = [];
    let answerTempObj: Answer;

    // Prüfvariablen
    let doCheck: Boolean = true;
      // Zählervariablen als Prüfvariablen
    let counterofRightAnswers = 0;
    let counterofGivenRightAnswers = 0;

    if(isMultiple && liste)
    {

      // Prüfen ob ausgewählte Antwort schon einmal selektiert wurde
      // Wenn ja, dann heißt dies, Antwort DE-Selektieren
      if(button.classList.contains('border-warning')) {
        button.classList.remove('border-warning');
        doCheck = false;
      } else {
        button.classList.add('border-warning');
        doCheck = true;
      }

      // Für unser "Selbstgebautes" Antwortenobject benötigen wir
      // die ausgewählten antworten vom user. Dafür ist die klasse
      // border-warning (gelbe umrandung) wichtig.
      for(let i = 0; i < liste.children.length; i++)
      {
        if(liste.children[i].classList.contains('border-warning')){
          buttonAnswerArray.push('1');
        }
        else {
          buttonAnswerArray.push('0');
        }
      }

      // Das Antwortenobject zusammenfrickeln...
      answerTempObj = {id: this.answerByQuestion.id, answers: buttonAnswerArray}

      // Prüfen ob überhaupt schon eine Antwort in unserem Array ist
      // Wenn ja, dann durchlaufen wir erstmal jedes element und suchen im Object des elements
      // Ob die Frage schon einmal beantwortet wurde, wenn ja tauschen wir die objekte aus,
      // wenn nicht fügen wir einfach die antwort als neuen wert hinzu.
      if(this.answersByUser.length == 0)
      {
        this.answersByUser.push(answerTempObj);
      } else {

        let found: Boolean = false;
        for(let i = 0; i < this.answersByUser.length; i++)
        {
          if(this.answersByUser[i].id == this.answerByQuestion.id)
          {
            this.answersByUser.splice(i, 1, answerTempObj);
            found = true;
          }
        }

        !found ? this.answersByUser.push(answerTempObj) : false;

      }
      this.vorpruefungQuestionList[this.questionIDForArray].q_answered = true;

      //
    }//REMOVE BY ENABLING ALL OTHER FUNCTIONS!!!!

    //   // Über die ANTWORTEN itterieren und zählen wie viele Antworten RICHTIG sind.
    //   this.answerByQuestion.answers.forEach(answer => {
    //     answer == '1' ? counterofRightAnswers++ : false
    //   });

    //   if(this.answerByQuestion.answers[answerID] == '1') {
    //     button.classList.add('class', 'border-success');
    //     button.setAttribute('disabled', 'true');
    //     button.setAttribute('selected', 'true');
    //   }

    //   console.log(this.answersByUser);

    //   // Über das HTML Element iterrieren um herauszufinden welche buttons schon geklickt wurden.
    //   // Anhand des attributes "disabled"
    //   for(let i = 0; i < liste.children.length; i++)
    //   {
    //     if(liste.children[i].hasAttribute('disabled')){
    //       counterofGivenRightAnswers++
    //     }
    //   }

    //   // Wenn die countervariablen übereinstimmen, wird die frage gesperrt.
    //   if(counterofGivenRightAnswers === counterofRightAnswers)
    //   {
    //     for (let i = 0; i < liste.children.length; i++) {
    //       liste.children[i].setAttribute('disabled', 'true');
    //     }
    //     this.resetButton = true;
    //   }

    //   if(this.answerByQuestion.answers[answerID] == '0') {
    //     button.classList.add('class', 'border-danger');
    //     for (let i = 0; i < liste.children.length; i++) {
    //       liste.children[i].setAttribute('disabled', 'true');
    //     }
    //     this.resetButton = true;
    //   }
    // }
    // else
    // {
    //   if(this.answerByQuestion.answers[0] == this.answerInput) { this.resetButton = true; button.classList.add('class', 'border-success'); button.setAttribute('disabled', ''); }
    //   if(this.answerByQuestion.answers[0] !== this.answerInput) { this.resetButton = true; button.classList.add('class', 'border-danger'); button.setAttribute('disabled', ''); }
    // }

    // this.vorpruefungQuestionList[this.questionIDForArray].q_answered = true;
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
