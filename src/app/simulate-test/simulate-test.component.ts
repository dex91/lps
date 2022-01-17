import { Component, OnInit } from '@angular/core';
import { examValue, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, Router, NavigationStart, Event } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'lps-simulate-test',
  templateUrl: './simulate-test.component.html',
  styleUrls: ['./simulate-test.component.css']
})
export class SimulateTestComponent implements OnInit {

  modus?: Modus;
  exam?: examValue;
  moduleModus: String = "pruefung";
  poolSelected: Boolean = false;
  poolURIName: String = "";

  examObserver: Observable<examValue> = new Observable(observer => {
    observer.next(this.db.getExamValue());
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
    this.modus = { ...this.modus, mode: this.moduleModus, lernmodus: false ,teilpruefung: false, pruefungsmodus: true };
    this.db.setMode(this.modus);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

        if (event.navigationTrigger === 'popstate') {
          this.db.exitExam();
        }
      }
  });

  }

  ngOnInit(): void {

    setInterval(() => {
      this.examObserver.subscribe(examValues => {
        this.exam = examValues;
      });
    }, 150);

  this.route.paramMap.subscribe(nav => {
    this.poolURIName = String(nav.get('poolURIName'));
  });

  if (this.poolURIName !== 'null') {
    this.poolSelected = true;

    if(this.exam?.warning)
    {
    this.startExam();
    }
    else {
      this.router.navigate([this.modus?.mode]);
    }
  }

  }

  warningAccepted(){
    this.exam = { warning: true}
    this.db.setExamValue(this.exam);
  }

  startExam() {
    this.exam = { ...this.exam , examStarted: true, examTimer: 1801, examProgressPercent: 0, showProgress: true }
    this.db.setExamValue(this.exam);
    this.router.navigate([this.modus?.mode, this.poolURIName, 1]);
  }

  exitExam() {
    this.db.exitExam();
  }

}
