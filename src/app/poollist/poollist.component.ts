import { Component, OnInit } from '@angular/core';
import { QuestionPool, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lps-poollist',
  templateUrl: './poollist.component.html',
  styleUrls: ['./poollist.component.css']
})
export class PoollistComponent implements OnInit {

  poolURIName = String(this.route.snapshot.paramMap.get("poolURIName"));
  pools: QuestionPool[] = [];
  modus?: Modus;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
  ) {
    this.modus = this.db.getMode();
   }

  ngOnInit(): void {
    this.db.getPools().subscribe(res => this.pools = res);
  }

}
