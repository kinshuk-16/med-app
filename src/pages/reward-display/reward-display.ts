import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFire /*, FirebaseListObservable*/ } from 'angularfire2';
/*
  Generated class for the RewardDisplay page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reward-display',
  templateUrl: 'reward-display.html'
})
export class RewardDisplayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
  	var med = navParams.get("medicine");
  	alert(JSON.stringify(med));
  	//find out who the user is
  	var userId = firebase.auth().currentUser.uid;
  	// check if show rewards is true in meds database
  	// var queryObservable = af.database.list('/meds', {
   //    query: {
   //      orderByChild: 'user',
   //      equalTo: subject
   //    }
   //  });
  	// if yes - take out rewards for this user from rewards
  	// take out support message
  	// show random
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardDisplayPage');
  }

}
