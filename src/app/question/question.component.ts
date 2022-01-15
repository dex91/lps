import { Component, OnInit } from '@angular/core';
import { Question, Answer, Modus, examValue } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'lps-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  // Für die API und den Modus "globale" variablen
  questionURIid: number = 0;
  poolURIName: String = "";
  modus?: Modus;
  exam?: examValue;

  // Einzelfrage (lernmodus)
  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };

  // Variablen für Teil und Prüfungsmodus
  showhelp: Boolean = false;
  answerInput: String = "";
  resetButton: Boolean = false;
  answersByUser: Answer[] = [];
  vorpruefungQuestionList: Question[] = []; // Hier mit ARRAY da wir Daten zwischenspeichern müssen.
  questionIDForArray: any;
  questionCount: Number = 0;


  examObserver: Observable<examValue> = new Observable(observer => {
    observer.next(this.db.getExamValue());
    observer.complete();
});

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.modus = this.db.getMode();
    this.exam = this.db.getExamValue();

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

    setInterval(() => {
      this.examObserver.subscribe(examValues => {
        this.exam = examValues;
        this.db.setExamValue({...this.exam, examQuestions: this.vorpruefungQuestionList.length });
      });
    }, 150);

    this.route.paramMap.subscribe(nav =>{

      this.questionURIid = parseInt(nav.get('questionId') || '0');
      this.poolURIName = String(nav.get('poolURIName'));

      if(this.questionURIid == 0 || this.questionURIid == null || this.questionURIid == undefined) { this.questionURIid = 1; }

      this.questionIDForArray = this.questionURIid-1;

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

      if(this.modus?.lernmodus)
      {
        this.db.APIgetQuestionById(this.questionURIid).subscribe(res => this.selectedQuestion = res);
        this.db.APIgetAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);
      }

    });

    if(this.modus?.pruefungsmodus)
    {

      if(this.vorpruefungQuestionList.length == 0) {
        this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
          this.db.APIgetPruefungsQuestionsByPoolId(Number(pool.id), 2).subscribe(qlist =>
            {
            this.vorpruefungQuestionList = qlist;
          })
        });
      }
      // ANTWORTEN WERDEN SEPERAT GEHOLT!! NICHT JETZT!
      // this.db.APIgetAnswerById(this.questionURIid).subscribe(answer => this.answerByQuestion = answer);
    }



  }

  changevalues(value: number) {
    this.db.setExamValue({ ...this.exam, examProgress: value});
  }

  loadPruefungsQuestion(forward: Boolean){
    let navId = this.questionURIid;
     if (forward) {
      this.questionURIid++;
     } else {
      this.questionURIid--;
    }
    this.db.setExamValue({ ...this.exam, examProgress: this.questionURIid});

    this.router.navigate(['pruefung', this.poolURIName, this.questionURIid]);
  }

  toggleHelp() {
     return this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

  selectAnswer(button: HTMLElement, answerID: any, modus: String, liste?: HTMLElement){

    // Zählervariablen als Prüfvariablen
    let counterofRightAnswersAavailable = 0;
    let counterofGivenAnswers = 0;

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
        answer == '1' ? counterofRightAnswersAavailable++ : false
      });

      if(liste)
      {
        this.checkAnswer(answerID, '1', false);

        // Über das HTML Element iterrieren um herauszufinden welche buttons schon geklickt wurden.
        // Anhand des attributes "disabled"
        for(let i = 0; i < liste.children.length; i++)
        {
          if(liste.children[i].hasAttribute('disabled')){
            counterofGivenAnswers++
          }
        }

        // Wenn die countervariablen übereinstimmen, wird die frage gesperrt.
        if(counterofGivenAnswers === counterofRightAnswersAavailable)
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
    let modalWrongAnswer = document.getElementById('triggerUser');

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
      modalWrongAnswer?.click();
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
