import { Component, OnInit } from '@angular/core';
import { Answer, Question, QuestionPool, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'lps-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})

export class LearningComponent implements OnInit {

  // Prüfvariablen für das Front-end und Hilfsvariablen zur vordeklaration bzw. initialisierung
  poolSelected: Boolean = false;
  questionSelected: Boolean = false;
  poolURIName: String = "";
  questionURIid: Number = 0;

  modus?: Modus;
  moduleModus: String = "learning";

  stop: Boolean = false;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    this.modus = { ...this.modus, mode: this.moduleModus };
    //Dem Service Mitteilen für andere Komponenten, dass wir in einen bestimmten Modus arbeiten
    this.db.setMode(this.modus);

    this.poolURIName = String(this.route.snapshot.paramMap.get("poolURIName"));
    this.questionURIid = Number(this.route.snapshot.paramMap.get("questionId"));

    if(this.poolURIName !== 'null') { this.poolSelected = true; }
    if(this.questionURIid !== 0) { this.poolSelected = true; this.questionSelected = true; }

   }
}
