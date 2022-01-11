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

        // Fragen mit vom user ausgewählten antworten bestücken
        // Dies geschiet nur, wenn eine Frage beantwortet wurde,
        // sonst wird nur das formular entsperrt.
        // MUSS mit timeout gemacht werden... Daten benötigen etwas zeit...
        setTimeout(() => {
          if(this.vorpruefungQuestionList[this.questionIDForArray].q_answered == true)
          {
            this.answersByUser.forEach((el, i) =>
            {
              if(this.answerByQuestion.id == this.answersByUser[i].id)
              {

                if(this.vorpruefungQuestionList[this.questionIDForArray].q_answer_type === 3)
                {
                  this.checkAnswer(this.vorpruefungQuestionList[this.questionIDForArray].id, this.answersByUser[i].answers[0], true);
                  this.answerInput = this.answersByUser[i].answers[0];
                }
                else {
                  this.answersByUser[i].answers.forEach((el, y) =>
                  {
                    if(this.answersByUser[i].answers[y] == '1')
                    {
                      this.checkAnswer(y, this.answersByUser[i].answers[y], false);
                    }

                  });
                }
              }
            });
          }
          else {
            if(this.vorpruefungQuestionList[this.questionIDForArray].q_answer_type === 3)
            {
              let ele = document.getElementById(`answerButton_${this.vorpruefungQuestionList[this.questionIDForArray].id}`)
              this.answerInput = "";
              ele?.removeAttribute('disabled');
              ele?.classList.remove('border-success');
              ele?.classList.remove('border-danger');
              ele?.classList.remove('border-warning');
            }
            else {

              this.answerByQuestion.answers.forEach((el, z) =>
              {
              let ele = document.getElementById(`answerButton_${z}`);
              ele?.removeAttribute('disabled');
              ele?.classList.remove('border-success');
              ele?.classList.remove('border-danger');
              ele?.classList.remove('border-warning'); });
            }
          }
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


  toggleHelp() {
     return this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

  selectAnswer(button: HTMLElement, answerID: any, modus: String, liste?: HTMLElement){

    // Zählervariablen als Prüfvariablen
    let counterofRightAnswers = 0;
    let counterofGivenRightAnswers = 0;

      // Prüfen ob ausgewählte Antwort schon einmal selektiert wurde
      // Wenn ja, dann heißt dies, Antwort DE-Selektieren
      if(button.classList.contains('border-warning')) {
        button.classList.remove('border-warning');
      } else {
        button.classList.add('border-warning');
      }

      this.createAnswerbyUserObject(liste);

      // Über die ANTWORTEN itterieren und zählen wie viele Antworten einer Frage RICHTIG sind.
      this.answerByQuestion.answers.forEach(answer => {
        answer == '1' ? counterofRightAnswers++ : false
      });

      if(liste)
      {
        this.checkAnswer(answerID, '1', false);

        // Über das HTML Element iterrieren um herauszufinden welche buttons schon geklickt wurden.
        // Anhand des attributes "disabled"
        for(let i = 0; i < liste.children.length; i++)
        {
          if(liste.children[i].hasAttribute('disabled')){
            counterofGivenRightAnswers++
          }
        }

        // Wenn die countervariablen übereinstimmen, wird die frage gesperrt.
        if(counterofGivenRightAnswers === counterofRightAnswers)
        {
          for (let i = 0; i < liste.children.length; i++) {
            liste.children[i].setAttribute('disabled', '');
          }
        }
      } else { this.checkAnswer(answerID, this.answerInput, true); }
    }

  createAnswerbyUserObject(liste?: HTMLElement) {

    // Variablen für Antwortobjekt
    let buttonAnswerArray: Array<String> = [];
    let answerTempObj: Answer;

    if(liste)
    {
      // Für unser "Selbstgebautes" Antwortenobject benötigen wir
      // die ausgewählten antworten vom user. Dafür ist die klasse
      // border-warning (gelbe umrandung) wichtig. Natürlich auch alle anderen beiden, weil wegen mehrfach verwenden.
      for(let i = 0; i < liste.children.length; i++)
      {
        if(liste.children[i].classList.contains('border-warning') || liste.children[i].classList.contains('border-success') || liste.children[i].classList.contains('border-danger')){
          buttonAnswerArray.push('1');
        }
        else {
          buttonAnswerArray.push('0');
        }
      }
    }
    else
    {
      buttonAnswerArray.push(this.answerInput);
    }

      // Das Antwortenobject zusammenfrickeln...
      answerTempObj = {id: this.answerByQuestion.id, answers: buttonAnswerArray}

      // Prüfen ob überhaupt schon eine Antwort in unserem Array ist
      // Wenn ja, dann durchlaufen wir erstmal jedes element und suchen im Object des elements
      // ob die Frage schon einmal beantwortet wurde, wenn ja tauschen wir das object gegen unser neu generiertes aus,
      // wenn nicht fügen wir einfach die antwort als neuen wert hinzu.
      if(this.answersByUser.length == 0)
      {
        this.answersByUser.push(answerTempObj);
      } else {

        let found: Boolean = false;
        this.answersByUser.forEach((el, i) => {
          if(this.answersByUser[i].id == this.answerByQuestion.id)
          {
            this.answersByUser.splice(i, 1, answerTempObj);
            found = true;
          }
        });
        !found ? this.answersByUser.push(answerTempObj) : false;

      }
      this.vorpruefungQuestionList[this.questionIDForArray].q_answered = true;
  }

  checkAnswer(index: any, answer: String, isText: Boolean)
  {
    let btntoChange = document.getElementById(`answerButton_${index}`);

    if(isText) { index = 0; }

    if(this.answerByQuestion.answers[index] === answer) {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-success');
      btntoChange?.setAttribute('disabled', '');
    }
    else {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-danger');
      btntoChange?.setAttribute('disabled', '');
    }

    this.resetButton = true;
  }

  resetQuestion(element: HTMLElement, isMultiple: Boolean){

    if(isMultiple)
    {
      for (let i = 0; i < element.children.length; i++) {
        element.children[i].removeAttribute('disabled');
        element.children[i].classList.remove('border-success');
        element.children[i].classList.remove('border-danger');
      }

      this.answersByUser.forEach((el, i) => {
        if(this.answersByUser[i].id == this.answerByQuestion.id)
        {
          this.answersByUser.splice(i, 1);
        }
      });

    }
    else
    {
      element.removeAttribute('disabled');
      element.classList.remove('border-success');
      element.classList.remove('border-danger');
      this.answerInput = "";
    }
    this.resetButton = false;
    this.vorpruefungQuestionList[this.questionIDForArray].q_answered = false;
  }
}
