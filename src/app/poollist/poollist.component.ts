import { Component, OnInit } from '@angular/core';
import { QuestionPool, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';

@Component({
  selector: 'lps-poollist',
  templateUrl: './poollist.component.html',
  styleUrls: ['./poollist.component.css']
})
export class PoollistComponent implements OnInit {

  pools?: QuestionPool[];
  modus?: Modus;

  constructor(
    private db: DatabaseMysqlService
  ) {
    this.db.APIgetPools().subscribe(pools => this.pools = pools);
    this.modus = this.db.getMode();
   }

  ngOnInit(): void {
  }

}
