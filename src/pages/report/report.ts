import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFire /*, FirebaseListObservable*/ } from 'angularfire2';
/*
  Generated class for the Report page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {	
	days: any[];
	calShow: boolean;
	meds: any [];
	selectedMed: string;
	calendar : any [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire ) {
  	this.calShow = false;
  	var userId = firebase.auth().currentUser.uid;
  	var queryObservable = af.database.list('/meds', {
      query: {
        orderByChild: 'user',
        equalTo: userId
      }
    });
    queryObservable.subscribe(queriedItems =>{
    	this.meds = queriedItems;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  showReport(){
  	this.calShow = true;
  	for(let med of this.meds){
  		if(med.id == this.selectedMed){
  			var medStart = new Date(med.startDay);
  			var medLast = new Date(med.lastDay);
  			// only check for  april--- need to add logic for may
  			var dates = [];
  			var datesTaken =[];
  			for(let t in med.taken){
  				//console.log(med.taken[t].date);
  				var takenD = new Date(med.taken[t].date);
  				datesTaken.push(takenD.getDate());
  			}

  			dates.push({
  					date:"",
  					taken:""// blank means not taken active means taken
  				});
  			dates.push({
  					date:"",
  					taken:""
  				});
  			dates.push({
  					date:"",
  					taken: ""
  				});
  			dates.push({
  					date:"",
  					taken:""
  				});
  			dates.push({
  					date:"",
  					taken:""
  				});
  			for(let i =1; i<=30;i++){
  				dates.push({
  					date:i,
  					taken:(datesTaken.indexOf(i) == -1)? "": "active"
  				});
  			}
  			this.calendar =[];
  			if(medStart.getMonth() == 3){
  				this.calendar.push({
  					month: "April",
  					dates: dates,
  				});
  			}
  			
  		}
  	}
  }

}
