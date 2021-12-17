import { Component, OnInit } from '@angular/core';
import { Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute  } from '@angular/router';

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

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
  ) {
    this.modus = { ...this.modus, mode: this.moduleModus };
    this.db.setMode(this.modus);
  }

  ngOnInit(): void {

    this.poolURIName = String(this.route.snapshot.paramMap.get("poolURIName"));
    this.questionURIid = Number(this.route.snapshot.paramMap.get("questionId"));

    if(this.poolURIName !== 'null') { this.poolSelected = true; }
    if(this.questionURIid !== 0) { this.poolSelected = true; this.questionSelected = true; }

  }

}
