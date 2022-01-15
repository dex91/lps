import { Component, OnInit } from '@angular/core';
import { Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'lps-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})

export class LearningComponent implements OnInit {

  modus?: Modus;
  moduleModus: String = "learning";

  // Prüfvariablen für das Front-end und Hilfsvariablen zur vordeklaration bzw. initialisierung
  poolSelected: Boolean = false;
  questionSelected: Boolean = false;
  poolURIName: String = "";
  questionURIid: Number = 0;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    ) {
      this.modus = { ...this.modus, mode: this.moduleModus, lernmodus: true, teilpruefung: false, pruefungsmodus: false };
    this.db.setMode(this.modus);
   }

  ngOnInit(): void {

    this.route.paramMap.subscribe(nav =>{
      this.poolURIName = String(nav.get('poolURIName'));
      this.questionURIid = Number(nav.get('questionId'));
    });

    if(this.poolURIName !== 'null') { this.poolSelected = true; }
    if(this.questionURIid !== 0) { this.poolSelected = true; this.questionSelected = true; }

   }
}
