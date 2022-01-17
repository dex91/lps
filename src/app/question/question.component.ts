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

  // Zahlreiche zählvariablen
  counterofGivenAnswers = 0;
  counterofRightAnswersAavailable = 0;
  counterRightQuestions: number = 0;
  counterFailedQuestions: number = 0;
  examProgress: number = 0;
  examFailedQuestions: number = 0;


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
    // z.b Das der Resetbutton verschwindet
    // z.b Das eine Frage erneut geladen wird
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        this.showhelp = false;
        this.resetButton = false;
        setTimeout(() => {
          this.reloadQuestion();
        }, 250);
      }
    });
  }

  /**
   * Kontinuierliches laden der examdaten
   * Navigation-Abbonieren
   * Modus prüfen und daten holen
   */
  ngOnInit(): void {

    let getData = setInterval(() => {
      this.examObserver.subscribe(examValues => {
        this.counterRightQuestions = parseInt(this.exam?.examRightQuestion?.toString() || '0');
        this.counterFailedQuestions = parseInt(this.exam?.examFailedQuestion?.toString() || '0');
        this.examProgress = parseInt(this.exam?.examProgress?.toString() || '0');
        this.examFailedQuestions = parseInt(this.exam?.examFailedQuestion?.toString() || '0');
        this.db.setExamValue(examValues);

        if (this.exam?.examProgress == this.questionList.length) {
          this.db.setExamValue({ ...this.exam, examStarted: false, examDone: true });
          clearInterval(getData);
        }
        examValues.exit || examValues.examFailed || examValues.examDone ? clearInterval(getData) : false;
      });
    }, 50);

    this.route.paramMap.subscribe(nav => {
      this.questionURIid = parseInt(nav.get('questionId') || '0');
      this.poolURIName = String(nav.get('poolURIName'));
      if (this.questionURIid == 0 || this.questionURIid == null || this.questionURIid == undefined) { this.questionURIid = 1; }
      this.questionIDForArray = this.questionURIid - 1;
    });

    if (this.modus?.pruefungsmodus) {
      this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {
        this.db.APIgetPruefungsQuestionsByPoolId(Number(pool.id), 8).subscribe(qlist => {
          this.questionList = qlist;
          this.exam = { ...this.exam, examQuestions: qlist.length };
        });
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

  /**
   * Kümmert sich um das vor und zurückschalten der Frage in der Prüfung (triggered by button).
   * @param forward Angabe ob vorwärts oder nicht.
   */
  loadPruefungsQuestion(forward: Boolean) {
    if (forward) {
      this.questionURIid++;
    } else {
      this.questionURIid--;
    }
    this.router.navigate([this.modus?.mode, this.poolURIName, this.questionURIid]);
  }

  /**
   * Kümmert sich darum, dass die Frage wieder bestückt wird mit den getätigten aktionen vom Nutzer, sofern
   * diese Frage schon einmal "angetoucht" wurde :)
   */
  reloadQuestion() {
    // Eingabefeld VORHER zurücksetzen....
    let liste = document.getElementById('auswahlliste');
    this.answerInput = "";
    document.getElementById(`answerButton_${this.questionList[this.questionIDForArray].id}`)?.classList.remove('border-warning');
    document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.setAttribute('disabled', '');

    if (liste) {
      for (let i = 0; i < liste.children.length; i++) {
        liste.children[i].classList.remove('border-warning');
        liste.children[i].classList.remove('border-danger');
        liste.children[i].classList.remove('border-success');
        if (this.questionList[this.questionIDForArray].q_answered && this.modus?.mode !== 'pruefung') {
          liste.children[i].setAttribute('disabled', '');
        } else { liste.children[i].removeAttribute('disabled'); }
      }
    }

    // Modus prüfen
    if (this.modus?.mode !== 'pruefung') {
      // Prüfen ob die Frage beantwortet wurde (teilprüfmodi)
      if (this.questionList[this.questionIDForArray].q_answered == true) {
        this.answersByUser.forEach((el, i) => {
          if (this.answerList[this.questionIDForArray].id == this.answersByUser[i].id) {

            if (this.questionList[this.questionIDForArray].q_answer_type === 3) {
              this.checkAnswer(this.questionList[this.questionIDForArray].id, this.answersByUser[i].answers[0], true, true);
              this.answerInput = this.answersByUser[i].answers[0];
            }
            else {
              this.answersByUser[i].answers.forEach((el, y) => {
                if (this.answersByUser[i].answers[y] == '1') {
                  this.checkAnswer(y, this.answersByUser[i].answers[y], false, true);
                }

              });
            }
          }
        });
      }
    } else {

      this.answersByUser.forEach((el, i) => {

        if (this.questionList[this.questionIDForArray].id == this.answersByUser[i].id) {
          if (this.questionList[this.questionIDForArray].q_answer_type === 3) {
            let btnToChange = document.getElementById(`answerButton_${this.questionList[i].id}`);
            document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.removeAttribute('disabled');
            this.answerInput = this.answersByUser[i].answers[0];
            if (btnToChange) {
              this.selectAnswer(btnToChange, i, this.answersByUser[i].id);
            }
          }
          else {
            this.answersByUser[i].answers.forEach((el, y) => {
              if (this.answersByUser[i].answers[y] == '1') {
                document.getElementById(`frageEinreichen_${this.questionList[this.questionIDForArray].id}`)?.removeAttribute('disabled');
                let btnToChange = document.getElementById(`answerButton_${this.answersByUser[i].id}_${y}`)?.classList.add('border-warning');
                if (btnToChange) {
                  this.selectAnswer(btnToChange, y, this.answersByUser[i].id);
                }
              }

            });
          }
        }

      });
    }
  }

  /**
   * Selektiert und prüft eine Frage. (Je nach modus)
   * @param button Das HTML-Element vom Button. (Kann auch INPUT sein)
   * @param answerID ID von der ausgewählten Frage. antwortButton_ID
   * @param questionID Die ID der Frage
   * @param liste Das Listenelement <ul> (nicht benötigt)
   */
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

      if (this.questionList[this.questionIDForArray].q_answer_type === 3) {
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

        if (liste) {
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

  /**
   * Baut bzw. hält unser Array für bereits getätigte Antworten up2Date oder erstellt dieses.
   * @param questionID Die ID der Frage
   * @param liste Sofern vorhanden die HTML-UL-Liste der Antworten
   */
  createAnswerbyUserObject(questionID: any, liste?: HTMLElement) {

    // Variablen für Antwortobjekt
    let buttonAnswerArray: Array<String> = [];
    let answerTempObj: Answer;

    if (liste) {
      // Für unser "Selbstgebautes" Antwortenobject benötigen wir
      // die ausgewählten antworten vom user. Dafür ist die klasse
      // border-warning (gelbe umrandung) wichtig. Natürlich auch alle anderen beiden, weil wegen mehrfach verwenden.
      for (let i = 0; i < liste.children.length; i++) {
        if (liste.children[i].classList.contains('border-warning') || liste.children[i].classList.contains('border-success') || liste.children[i].classList.contains('border-danger')) {
          buttonAnswerArray.push('1');
        }
        else {
          buttonAnswerArray.push('0');
        }
      }
    }
    else {
      buttonAnswerArray.push(this.answerInput);
    }

    // Das Antwortenobject zusammenfrickeln...
    answerTempObj = { id: questionID, answers: buttonAnswerArray }

    // Prüfen ob überhaupt schon eine Antwort in unserem Array ist
    // Wenn ja, dann durchlaufen wir erstmal jedes element und suchen im Object des elements
    // ob die Frage schon einmal beantwortet wurde, wenn ja tauschen wir das object gegen unser neu generiertes aus,
    // wenn nicht fügen wir einfach die antwort als neuen wert hinzu.
    if (this.answersByUser.length == 0) {
      this.answersByUser.push(answerTempObj);
    } else {

      let found: Boolean = false;
      this.answersByUser.forEach((el, i) => {
        if (this.answersByUser[i].id == questionID) {
          this.answersByUser.splice(i, 1, answerTempObj);
          found = true;
        }
      });
      !found ? this.answersByUser.push(answerTempObj) : false;

    }
    this.modus?.mode !== 'pruefung' ? this.questionList[this.questionIDForArray].q_answered = true : false;
  }

  /**
   * Überprüft ganz primitiv eine ausgewählte Antwort mit der vom Antworten objekt
   * @param index der zu prüfende index
   * @param answer die zu prüfende antwort (string aus dem [].answers array)
   * @param isText handelt es sich um eine FILL-in Frage?
   * @param reloaded Zur feststellung ob die Funktion beim reload der Frage aufgerufen wurde (optional)
   */
  checkAnswer(index: any, answer: String, isText: Boolean, reloaded?: Boolean) {
    let btntoChange = document.getElementById(`answerButton_${index}`);
    let modalWrongAnswer = document.getElementById('triggerUser');
    let modalWrongAnswers = document.getElementById('triggerUserByReload');

    if (isText) { index = 0; }

    if (this.answerList[this.questionIDForArray].answers[index] === answer) {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-success');
      btntoChange?.setAttribute('disabled', '');
    }
    else {
      btntoChange?.classList.remove('border-warning');
      btntoChange?.classList.add('border-danger');
      btntoChange?.setAttribute('disabled', '');
      !reloaded ? modalWrongAnswer?.click() : modalWrongAnswers?.click()
    }

    this.resetButton = true;
  }

  /**
   * Vergleicht die Antworten vom Server mit denen die der User gegeben hat in der Prüfung.
   * Da es KEINE Teilpunkte gibt, werden hier direkt beide "antwortenarrays" miteinander verglichen.
   * Zum schluss werden nötige counter und flags gesetzt.
   * Und diese Funktion leitet den Nutzer auf die erste noch nicht beantwortete frage weiter
   * @param checkExamQuestionId ID der Frage zum überprüfen
   */
  checkExamAnswer(checkExamQuestionId: Number) {

    let firstarraytocheck: Array<String> = [];
    let secondarraytocheck: Array<String> = [];
    let lastUnansweredQuestion: Array<number> = [];
    let rightAnswers: number = 0;

    this.answerList.forEach(el => {
      if (el.id == checkExamQuestionId) {
        firstarraytocheck = el.answers;
      }
    });

    this.answersByUser.forEach(el => {
      if (el.id == checkExamQuestionId) {
        secondarraytocheck = el.answers;
      }
    });

    firstarraytocheck.forEach((el, i) => {
      if (el === secondarraytocheck[i]) {
        rightAnswers++;
      }
    });

    if (rightAnswers === firstarraytocheck.length) {
      this.counterRightQuestions++;
    } else {
      this.counterFailedQuestions++;
    }

    this.examProgress++
    this.exam = { ...this.exam, examFailedQuestion: this.counterFailedQuestions, examRightQuestion: this.counterRightQuestions, examProgress: this.examProgress };
    this.db.setExamValue(this.exam);
    this.questionList[this.questionIDForArray].q_answered = true;

    lastUnansweredQuestion = [];

    this.questionList.forEach((el, i) =>{
      if (!this.questionList[i].q_answered) {
        lastUnansweredQuestion.push(i+1);
      }
    });

    if(isFinite(Math.min(...lastUnansweredQuestion))) {
      this.router.navigate([this.modus?.mode, this.poolURIName, Math.min(...lastUnansweredQuestion)]);
    }
  }

  /**
   * Resettet die Frage im Teilprüfungsmodus
   * Zum schluss werden noch flags gesetzt für die frage und der resetbutton soll ausgeblendet werden.
   * @param element Das HTML-Element der Frage
   * @param isMultiple Prüfung ob es eine Single bzw Multiple-choise frage ist
   */
  resetQuestion(element: HTMLElement, isMultiple: Boolean) {

    if (isMultiple) {
      for (let i = 0; i < element.children.length; i++) {
        element.children[i].removeAttribute('disabled');
        element.children[i].classList.remove('border-success');
        element.children[i].classList.remove('border-danger');
      }

      this.answersByUser.forEach((el, i) => {
        if (this.answersByUser[i].id == this.answerList[this.questionIDForArray].id) {
          this.answersByUser.splice(i, 1);
        }
      });

    }
    else {
      element.removeAttribute('disabled');
      element.classList.remove('border-success');
      element.classList.remove('border-danger');
      this.answerInput = "";
    }
    this.resetButton = false;
    this.questionList[this.questionIDForArray].q_answered = false;
  }

  /**
   * Kümmert sich um das ein bzw. ausblenden der hilfetexte.
   */
  toggleHelp() {
    this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

}
