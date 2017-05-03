import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
	detail: boolean;
	detailMessage: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController ) {
  	this.calShow = false;
  	this.detail = true;
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
  			//var medLast = new Date(med.lastDay);
  			// only check for  april--- need to add logic for may
  			var dates = [];
  			var datesTaken =[];
  			for(let t in med.taken){
  				//console.log(med.taken[t].date);
  				var takenD = new Date(med.taken[t].date);
  				datesTaken.push(takenD.getDate());
  			}
        //console.log(datesTaken);
  			// dates.push({
  			// 		date:"",
  			// 		taken:""// blank means not taken active means taken
  			// 	});
  			// dates.push({
  			// 		date:"",
  			// 		taken:""
  			// 	});
  			// dates.push({
  			// 		date:"",
  			// 		taken: ""
  			// 	});
  			// dates.push({
  			// 		date:"",
  			// 		taken:""
  			// 	});
  			// dates.push({
  			// 		date:"",
  			// 		taken:""
  			// 	});
  			for(let i =1; i<=31;i++){
  				dates.push({
  					date:i,
  					taken:(datesTaken.indexOf(i) == -1)? "": "active"
  				});
  			}
        //console.log(dates);
  			this.calendar =[];
  			if(medStart.getMonth() == 4){ // changed from 3 to 4 for May
  				this.calendar.push({
  					month: "May", //changed to MAy from April
  					dates: dates,
  				});
  			}
  			
  		}
  	}
  }

  showDetail(day){
  	if(day.taken == "active"){
  		this.detail = true;
	  	//var times = []
	  	var cnt = 0;
	  	for(let med of this.meds){
	  		if(med.id == this.selectedMed){
	  			//var flag = false;
	  			for(let t in med.taken){
	  				var takenD = new Date(med.taken[t].date);
	  				if(takenD.getDate() == day.date){
	  					// console.log("here");
	  					// var flag = true; // data not entered
	  					// for(let time of times){
	  					// 	if(time.medTime == med.taken[t].time){
	  					// 		time.cnt += 1;
	  					// 		flag = true; // data entered
	  					// 	}
	  					// }
	  					// if(flag){// data still not entered
	  					// 	times.push({
			  			// 			medTime: med.taken[t].time,
			  			// 			cnt: 1
			  			// 		});
	  					// }
	  					cnt += 1;

	  				}
	  			}
	  			this.detailMessage = "You took "+med.name+" "+ cnt+ " times on this day";
	  		}
	  	}
     }

//  	console.log(times);
    this.detailMessage +="\n \n **According to your medication history, it looks like you tend to miss most medication on weekends.**" // tentative
  	console.log(this.detailMessage);

  }

  info(){
    console.log("info cicked");
    let confirm = this.alertCtrl.create({
      title: 'About Report Page',
      subTitle: `Select a medicine from the drop down and click on "Show Report" to view the days you have taken this medicine.
      To view more details and analysis, click on a highlighted date.`,
      buttons: ['OK']
    });
    confirm.present();
  }

}
