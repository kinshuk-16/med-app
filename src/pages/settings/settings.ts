import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire} from 'angularfire2';
import { Page2 } from '../page2/page2';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
	med: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
  	this.med = navParams.get("medicine");
  	console.log(this.med);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  done(){
  	console.log(this.med);
  	//set database object
    this.af.database.object("meds/"+ this.med.id+ "/sound").set(this.med.sound);
  	this.af.database.object("meds/"+ this.med.id+ "/reward").set(this.med.reward);
    this.af.database.object("meds/"+ this.med.id+ "/support").set(this.med.support);
  	// go back to page 2
  	this.navCtrl.setRoot(Page2); 
  }

}
