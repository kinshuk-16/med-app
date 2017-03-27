import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { Page2 } from '../page2/page2';

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
	nextId: number;
	medInfo: any = {};
  addText: String;
  editFlag: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(navParams.get("nextId")){
        this.medInfo ={
        name: "",
        times: "one",
        medtime: [{time: "07:00"}],
        days: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
        sound: "seashore",
        noDays: undefined,
        shape:"assets/img/capsule.png",
        daysDone: 0
      }
      this.nextId = navParams.get("nextId");
      this.addText = "Add to my Cabinet";
      this.editFlag = false;
    }
    else{
      this.medInfo = navParams.get("medicine");
      this.addText = "Done Editing";
      this.editFlag = true;
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

  // public getClass(time){
  // 	var hr = parseInt(time.split(":"));
  // 	if(hr < 12 && hr > 2){
  // 		return "morning";
  // 	}
  // 	if(hr >= 12 && hr < 18){
  // 		return "afternoon";
  // 	}
  // 	return "evening";
  // }

  public doneAdding(){
  	console.log("done adding");
    console.log(this.medInfo);
  	//var meds = [];
  	// for(let t of this.medInfo.medtime){
  	// 	meds.push({
  	// 	id: this.nextId,
   //  	name: this.medInfo.name,
   //  	time: t.time,
   //  	dosage:"180mg",
   //  	qty: "1",
   //  	icon:"icon.png",
   //  	class: this.getClass(t.time)
  	// 	})
  	// 	this.nextId = this.nextId + 1;
  	// }
  	//console.log(meds);
  	this.navCtrl.push(Page2,{
  		newMed: this.medInfo,
      edit: this.editFlag
  	});
  }
}
