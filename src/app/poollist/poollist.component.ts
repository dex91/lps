import { Component, OnInit } from '@angular/core';
import { QuestionPool, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lps-poollist',
  templateUrl: './poollist.component.html',
  styleUrls: ['./poollist.component.css']
})
export class PoollistComponent implements OnInit {

  pools?: QuestionPool[];
  modus?: Modus;
  redirectUriName: String = '';

  constructor(
    private db: DatabaseMysqlService,
    private router: Router,
  ) {
    this.db.APIgetPools().subscribe(pools => this.pools = pools);
    this.modus = this.db.getMode();
   }

  ngOnInit(): void {
  }

  selectPool(poolName: String, auswahlListe: HTMLElement, selectedFrage: Number)
  {
    let poolAuswahl = document.getElementById(selectedFrage.toString());
    let startButton = document.getElementById('startBtn');

    if(poolAuswahl?.classList.contains('active')) {
      poolAuswahl?.classList.remove('active');

      for(let i = 0; i < auswahlListe.children.length; i++)
      {
        if(auswahlListe.children[i].classList.contains('disabled')){
          auswahlListe.children[i].classList.remove('disabled');
        }
      }

    } else {
      poolAuswahl?.classList.add('active');

      for(let i = 0; i < auswahlListe.children.length; i++)
      {
        if(!auswahlListe.children[i].classList.contains('active')){
          auswahlListe.children[i].classList.add('disabled');
        }
      }

    }

    if(startButton?.hasAttribute('hidden')) {
      startButton.removeAttribute('hidden');
      startButton.classList.remove('btn-outline-primary');
      startButton.classList.add('btn-outline-success');
      startButton.classList.add('blink_me');
    } else {
      startButton?.setAttribute('hidden', '');
      startButton?.classList.remove('btn-outline-success');
      startButton?.classList.remove('blink_me');
      startButton?.classList.add('btn-outline-primary');
    }

    return this.redirectUriName = poolName;
  }

  goForward() {
    this.router.navigate([this.modus?.mode, this.redirectUriName]);
  }

}
