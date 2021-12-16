import { Component, OnChanges, OnInit } from '@angular/core';
import { Question, Answer, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lps-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {


  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };
  questionURIid = Number(this.route.snapshot.paramMap.get("questionId"));
  modus?: Modus;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.db.getQuestionById(this.questionURIid).subscribe(res => this.selectedQuestion = res);
    this.db.getAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);

  }

}
