import { Component, OnInit } from '@angular/core';
import { Modus, QuestionPool } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'lps-test-yourself',
  templateUrl: './test-yourself.component.html',
  styleUrls: ['./test-yourself.component.css']
})
export class TestYourselfComponent implements OnInit {

  modus?: Modus;
  moduleModus: String = "vorpruefung";

  // Prüfvariablen für das Front-end und Hilfsvariablen zur vordeklaration bzw. initialisierung
  poolSelected: Boolean = false;
  questionSelected: Boolean = false;
  poolURIName: String = "";
  questionURIid: Number = 0;

  questionPool?: QuestionPool;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
  ) {

    this.modus = { ...this.modus, mode: this.moduleModus, teilpruefung: true };
    this.db.setMode(this.modus);


  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(nav =>{
      this.poolURIName = String(nav.get('poolURIName'));
      this.questionURIid = Number(nav.get('questionId'));
    });

    if(this.poolURIName !== 'null') {
      this.poolSelected = true;
      this.questionSelected = false;
    }

    if(this.questionURIid !== 0) {
      this.poolSelected = true;
      this.questionSelected = true;
    }

   }

}
