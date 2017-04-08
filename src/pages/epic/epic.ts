import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Page2 } from '../page2/page2';

/*
  Generated class for the Epic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-epic',
  templateUrl: 'epic.html'
})
export class EpicPage {
  fname: string;
  lname: string;
  gender: string;
  medInfo: any = {};
  meds: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: Http, public af: AngularFire,
  	public alertCtrl: AlertController) {}

  
  getUser(fname, lname, gender){
  	var url = `https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient?family=`+lname+`&given=`+fname+`&gender=`+gender;
  	return this.http.get(url).map((res:Response) => res.json());
  }

  getMeds(id){
  	var url = `https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/MedicationOrder?patient=`+id;
  	return this.http.get(url).map((res:Response) => res.json());
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  prepareMeds(id){
  	this.getMeds(id).subscribe(data =>{
  		if(data.entry[0].resource.medicationReference){
  			data.entry.forEach((entry,index) => {
	  			//console.log(entry);
	  			var d = new Date();
	      		var userId = firebase.auth().currentUser.uid;
	  			//console.log(entry.resource.medicationReference.display);
	  			this.medInfo ={
			        name: entry.resource.medicationReference.display.split(" ")[0],
			        times: 1,
			        medtime: [{time: "07:00"}],
			        days: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
			        sound: "seashore",
			        noDays: 7,
			        shape:"assets/img/capsule.png",
			        timesTaken: 0,
			        id: d.toString()+index,
			        user: userId,
              lastDay: this.addDays(d, 7).toDateString(),
              startDay: d.toDateString(),
              taken: ""
			      };
			      //console.log(this.medInfo);
	      		  this.af.database.object("meds/"+ this.medInfo.id).set(this.medInfo);
	  		});
	  		this.navCtrl.setRoot(Page2); 
  		}
  		else{
  			let alert = this.alertCtrl.create({
	            message: "Looks like the system does not have any medicine added under your name. Please enter your medicine manually.",
	            buttons: [
	              {
	                text: "Ok",
	                role: 'cancel'
	              }
	            ]
	          });
	          alert.present();
  		}
  		
  	});
  }

  callEpic(){
  	console.log(this.fname+ this.lname + this.gender);
    
  	this.getUser(this.fname, this.lname, this.gender).subscribe(data =>{
  		if(data.entry[0].fullUrl){
  			var id = data.entry[0].fullUrl.split("/")[8];
	  		//console.log(id);
	  		this.prepareMeds(id);
  		}
  		else{
  			let alert = this.alertCtrl.create({
	            message: "Your record wasn't found. Check the details and make sure it is correct or enter manually.",
	            buttons: [
	              {
	                text: "Ok",
	                role: 'cancel'
	              }
	            ]
	          });
	          alert.present();
	  		}
  	})		
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpicPage');
  }

}
