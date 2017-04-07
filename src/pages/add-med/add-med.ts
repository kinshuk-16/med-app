import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { Page2 } from '../page2/page2';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the AddMed page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-med',
  templateUrl: 'add-med.html'
})
export class AddMedPage {
	medInfo: any = {};
  addText: String;
  editFlag: boolean;
  meds: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    if(navParams.get("medicine")){ // editing
       this.medInfo = navParams.get("medicine");
      this.addText = "Done Editing";
      this.editFlag = true;
    }
    else{ // adding
      var d = new Date();
      var userId = firebase.auth().currentUser.uid;
      this.medInfo ={
        name: "",
        times: "one",
        medtime: [{time: "07:00"}],
        days: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
        sound: "seashore",
        noDays: 0,
        shape:"assets/img/capsule.png",
        daysDone: 0,
        id: d.toString(),
        user: userId,
        lastDay: "",
        taken: [{date:""}]
      }
      
      //this.nextId = navParams.get("nextId");
      this.addText = "Add to my Cabinet";
      this.editFlag = false;
    }
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMedPage');
  }
  public timeSelected(){
  	//console.log(this.medInfo.times);
  	//console.log(this.medInfo.medtime);
  	

  	if(this.medInfo.times == "one"){
  		this.medInfo.medtime = []; // none of the times are displaying
  		this.medInfo.medtime.push({
  			time: "07:00"
  		});
  	}
  	else if(this.medInfo.times == "two"){
  		this.medInfo.medtime = []; 
  		this.medInfo.medtime.push({
  			time: "07:00"
  		});this.medInfo.medtime.push({
  			time: "19:00"
  		});
  	}
  	else if(this.medInfo.times == "three"){
  		this.medInfo.medtime = [];
  		this.medInfo.medtime.push({
  			time: "07:00"
  		});this.medInfo.medtime.push({
  			time: "15:00"
  		});this.medInfo.medtime.push({
  			time: "19:00"
  		});
  	}
  	else{
  		//custom - for now set it to 0
  		this.medInfo.medtime = [];
  	}
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  public doneAdding(){
  	console.log("done adding/editing");
    //console.log(this.medInfo);
    if(!this.editFlag){
      // add the med to database
      this.medInfo.lastDay = this.addDays(new Date(), this.medInfo.noDays).toDateString();
      console.log(this.medInfo);
      this.af.database.object("meds/"+ this.medInfo.id).set(this.medInfo);
    }
    else{
      // add the med to database
      this.meds = this.af.database.list('/meds')
      this.meds.update(this.medInfo.id, this.medInfo);
    }

    //this.navCtrl.push(Page2);
    this.navCtrl.setRoot(Page2); 
  }
}
