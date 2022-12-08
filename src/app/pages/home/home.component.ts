import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Met, Weather } from '../../services/weather';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private _data!: Observable<Weather>;

  sub: Subscription = new Subscription();

  constructor(api: ApiService) {
    // this.sub.add(api.getCompactData().subscribe((d) => (this._data = d)));
    this._data = api.getCompactData();
  }

  ngOnInit(): void {}

  getDataObs(): Observable<Weather> {
    return this._data;
  }
}
