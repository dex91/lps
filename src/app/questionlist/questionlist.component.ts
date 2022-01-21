import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseMysqlService } from '../database-mysql.service';
import { Question, QuestionPool, Modus } from '../dateninterfaces';

@Component({
  selector: 'lps-questionlist',
  templateUrl: './questionlist.component.html',
  styleUrls: ['./questionlist.component.css']
})
export class QuestionlistComponent implements OnInit {

  poolURIName: String = "";
  modus?: Modus;
  questions?: Question[];
  questionPool?: QuestionPool;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    ) {

      this.modus = this.db.getMode();

      this.route.paramMap.subscribe(nav =>{
        this.poolURIName = String(nav.get('poolURIName'));
      });

      this.db.APIgetPoolByURIName(this.poolURIName).subscribe(pool => {

        this.questionPool = pool;

        this.db.APIgetQuestionsByPoolId(Number(pool.id)).subscribe(qlist => this.questions = qlist);

      });

    }

  ngOnInit(): void {

  }

}
