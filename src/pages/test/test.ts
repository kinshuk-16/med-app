import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

/*
  Generated class for the Test page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
	meds: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  	public af: AngularFire, public alertCtrl: AlertController) {
  	this.meds = af.database.list('/meds');
  	console.log(this.meds);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  addMed(){
  	let prompt = this.alertCtrl.create({
	    title: 'med Name',
	    message: "Enter a name for this new song you're so keen on adding",
	    inputs: [
	      {
	        name: 'name',
	        placeholder: 'Title'
	      },
	    ],
	    buttons: [
	      {
	        text: 'Cancel',
	        handler: data => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Save',
	        handler: data => {
	          // this.meds.push({
	          // 	id: 4,
	          //   name: data.name
	          // });
	          // use this to import initial data to database
	          this.af.database.object("meds/"+ "Tue Mar 28 2017 11:56:40 GMT-0700 (PDT)").set({
			      "id":"Tue Mar 28 2017 11:56:40 GMT-0700 (PDT)", // extraneous field
			      "name": "Ibuprofen",
			      "qty": "1",
			      "icon":"icon.png",
			      "times": "one",
			      "medtime": [{"time": "07:00"}],
			      "days": ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
			      "sound": "seashore",
			      "noDays": 14,
			      "daysDone": 1,
			      "shape": "assets/img/pill_round.png"
			    });
	          this.af.database.object("meds/"+ "Tue Mar 28 2017 11:55:13 GMT-0700 (PDT)").set({
			      "id":"Tue Mar 28 2017 11:55:13 GMT-0700 (PDT)",
			      "name": "Advil",
			      "qty": "1",
			      "icon":"icon.png",
			      "times": "one",
			      "medtime": [{"time": "07:00"}],
			      "days": ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
			      "sound": "seashore",
			      "noDays": 7,
			      "daysDone": 2,
			      "shape": "assets/img/capsule.png"
			    });

	        }
	      }
	    ]
	  });
	  prompt.present();
	  //this.meds.remove("1");
  }

}
