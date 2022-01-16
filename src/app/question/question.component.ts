import { Component, OnInit } from '@angular/core';
import { Question, Answer, Modus, examValue } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, NavigationStart, Router, Event, NavigationEnd } from '@angular/router';
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
  questionList: Question[] = [];
  answerList: Answer[] = [];

  // Variablen für Teil und Prüfungsmodus
  showhelp: Boolean = false;
  answerInput: String = "";
  resetButton: Boolean = false;
  answersByUser: Answer[] = [];
  questionIDForArray: any;
  counterofGivenAnswers = 0;
  counterofRightAnswersAavailable = 0;


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
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
          this.showhelp = false;
          this.resetButton = false;

          setTimeout(() => {
            this.reloadQuestion();
          },250);

      }
  });

  }

  ngOnInit(): void {

    setInterval(() => {
      this.examObserver.subscribe(examValues => {
        this.exam = examValues;
        this.db.setExamValue({...this.exam, examQuestions: this.questionList.length });
      });
    }, 150);

    this.route.paramMap.subscribe(nav =>{
      this.questionURIid = parseInt(nav.get('questionId') || '0');
      this.poolURIName = String(nav.get('poolURIName'));
      if(this.questionURIid == 0 || this.questionURIid == null || this.questionURIid == undefined) { this.questionURIid = 1; }
      this.questionIDForArray = this.questionURIid-1;
    });

    if(this.modus?.pruefungsmodus)
    {
      this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
        this.db.APIgetPruefungsQuestionsByPoolId(Number(pool.id), 1).subscribe(qlist => this.questionList = qlist);
        this.db.APIgetAnswersByPoolId(Number(pool.id)).subscribe(alist => this.answerList = alist);
      });
    }
    else {
      this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
        this.db.APIgetQuestionsByPoolId(Number(pool.id)).subscribe(qlist => this.questionList = qlist);
        this.db.APIgetAnswersByPoolId(Number(pool.id)).subscribe(alist => this.answerList = alist);
      });
    }
  }

  loadPruefungsQuestion(forward: Boolean){
     if (forward) {
      this.questionURIid++;
     } else {
      this.questionURIid--;
    }
    this.db.setExamValue({ ...this.exam, examProgress: this.questionURIid});

    this.router.navigate([this.modus?.mode, this.poolURIName, this.questionURIid]);
  }

  reloadQuestion() {

    // Eingabefeld VORHER zurücksetzen....
    this.answerInput = "";
    document.getElementById(`answerButton_${this.questionList[this.questionIDForArray].id}`)?.classList.remove('border-warning');
    document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.setAttribute('disabled', '');

    let liste = document.getElementById('auswahlliste');

    if (liste) {
      for (let i = 0; i < liste.children.length; i++) {
        liste.children[i].classList.remove('border-warning');
        liste.children[i].classList.remove('border-danger');
        liste.children[i].classList.remove('border-success');
        liste.children[i].removeAttribute('disabled');
      }
    }

    // Modus prüfen
    if(this.modus?.mode !== 'pruefung')
    {
      // Prüfen ob die Frage beantwortet wurde (teilprüfmodi)
      if(this.questionList[this.questionIDForArray].q_answered == true)
      {
        this.answersByUser.forEach((el, i) =>
        {
          if(this.answerList[this.questionIDForArray].id == this.answersByUser[i].id)
          {

            if(this.questionList[this.questionIDForArray].q_answer_type === 3)
            {
              this.checkAnswer(this.questionList[this.questionIDForArray].id, this.answersByUser[i].answers[0], true);
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
    } else {

      this.answersByUser.forEach((el, i) =>
      {

        if(this.questionList[this.questionIDForArray].id == this.answersByUser[i].id)
        {
          if(this.questionList[this.questionIDForArray].q_answer_type === 3)
          {
            let btnToChange = document.getElementById(`answerButton_${this.questionList[i].id}`);
            document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.removeAttribute('disabled');
            this.answerInput = this.answersByUser[i].answers[0];
            if(btnToChange) {
              this.selectAnswer(btnToChange, i, this.answersByUser[i].id);
            }
          }
          else {
            this.answersByUser[i].answers.forEach((el, y) =>
            {
              if(this.answersByUser[i].answers[y] == '1')
              {
                document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.removeAttribute('disabled');
                let btnToChange = document.getElementById(`answerButton_${this.answersByUser[i].id}_${y}`)?.classList.add('border-warning');
                if(btnToChange) {
                this.selectAnswer(btnToChange, y, this.answersByUser[i].id);
                }
              }

            });
          }
        }

      });
    }
  }

  selectAnswer(button: HTMLElement, answerID: any, questionID: any, liste?: HTMLElement) {

    this.counterofRightAnswersAavailable = 0;
    this.counterofGivenAnswers = 0;

    if (this.modus?.mode !== 'pruefung') {

      if (liste) {
        this.checkAnswer(answerID, '1', false);
        // Über die ANTWORTEN itterieren und zählen wie viele Antworten einer Frage RICHTIG sind.
        this.answerList[this.questionIDForArray].answers.forEach(answer => {
          answer == '1' ? this.counterofRightAnswersAavailable++ : false
        });

        // Über das HTML Element iterrieren um herauszufinden welche buttons schon geklickt wurden.
        // Anhand des attributes "disabled"
        for (let i = 0; i < liste.children.length; i++) {
          if (liste.children[i].hasAttribute('disabled')) {
            this.counterofGivenAnswers++;
          }
        }

        // Wenn die countervariablen übereinstimmen, wird die frage gesperrt.
        if (this.counterofGivenAnswers === this.counterofRightAnswersAavailable) {
          for (let i = 0; i < liste.children.length; i++) {
            liste.children[i].setAttribute('disabled', '');
          }
        }
      } else { this.checkAnswer(answerID, this.answerInput, true); }

      this.createAnswerbyUserObject(questionID, liste);

    } else {

      let btnFrageEinreichen = document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`);

      if(this.questionList[this.questionIDForArray].q_answer_type === 3)
      {
        if (!this.answerInput) {
          btnFrageEinreichen?.setAttribute('disabled', '');
          button?.classList.remove('border-warning');
        } else {
          btnFrageEinreichen?.removeAttribute('disabled');
          button?.classList.add('border-warning');
        }
      }
      else {

      // Prüfen ob ausgewählte Antwort schon einmal selektiert wurde
      // Wenn ja, dann heißt dies, Antwort DE-Selektieren
      if (button.classList.contains('border-warning')) {
        button.classList.remove('border-warning');
      } else {
        button.classList.add('border-warning');
      }

      if(liste) {
        for (let i = 0; i < liste.children.length; i++) {
          if (liste.children[i].classList.contains('border-warning')) {
            this.counterofGivenAnswers++;
          }
        }
      }
      this.counterofGivenAnswers <= 0 ? btnFrageEinreichen?.setAttribute('disabled', '') : btnFrageEinreichen?.removeAttribute('disabled');
    }
    this.createAnswerbyUserObject(questionID, liste);
    }

  }

  createAnswerbyUserObject(questionID: any, liste?: HTMLElement) {

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
      answerTempObj = {id: questionID, answers: buttonAnswerArray}

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
          if(this.answersByUser[i].id == questionID)
          {
            this.answersByUser.splice(i, 1, answerTempObj);
            found = true;
          }
        });
        !found ? this.answersByUser.push(answerTempObj) : false;

      }
      this.questionList[this.questionIDForArray].q_answered = true;
  }

  checkAnswer(index: any, answer: String, isText: Boolean)
  {
    let btntoChange = document.getElementById(`answerButton_${index}`);
    let modalWrongAnswer = document.getElementById('triggerUser');

    if(isText) { index = 0; }

    if(this.answerList[this.questionIDForArray].answers[index] === answer) {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-success');
      this.modus?.mode !== 'pruefung' ? btntoChange?.setAttribute('disabled', '') : false ;
    }
    else {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-danger');
      this.modus?.mode !== 'pruefung' ? btntoChange?.setAttribute('disabled', '') : false ;
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
        if(this.answersByUser[i].id == this.answerList[this.questionIDForArray].id)
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
    this.questionList[this.questionIDForArray].q_answered = false;
  }

  toggleHelp() {
    return this.showhelp ? this.showhelp = false : this.showhelp = true;
 }

}
