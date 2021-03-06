import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  med: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.med = navParams.get("medicine");
  	console.log(this.med);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }

}
