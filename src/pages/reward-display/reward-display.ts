import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFire /*, FirebaseListObservable*/ } from 'angularfire2';
import { DomSanitizer } from '@angular/platform-browser';
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
  noShow: boolean;
  music: boolean;
  pic: boolean;
  message: boolean;
  reward: any= {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public sanitizer: DomSanitizer) {
  	var meds = navParams.get("medicine");
  	var reward = false;
  	var support = false;
  	this.music = false;
  	this.pic = false;
  	this.message = false;
  	this.reward = {};

  	//if any medication has this set to true we will make it true
  	for(let med of meds){
  		if(med.reward == true){
  			reward = true;
  		}
  		if(med.support == true){
  			support = true;
  		}
  	}
  	this.noShow = !(reward || support);
  	
  	if(!this.noShow){
  		if(reward){
	  		if(support){
	  			//both are true - select 1
	  			var select = Math.floor(Math.random()*10);
	  			(select>5)?this.getReward(): this.getMessgae();
	  		}
	  		else{
	  			//show reward
	  			this.getReward();
	  		}
	  	}
	  	else{
	  		//show support
	  		this.getMessgae()
	  	}
  	}
  }

  getReward(){
  	console.log("reward");
  	var userId = firebase.auth().currentUser.uid;
  	var rewardObservable = this.af.database.list('/rewards', {
      query: {
        orderByChild: 'uid',
        equalTo: userId
      }
    });

    rewardObservable.subscribe(queriedItems =>{
    	var index = Math.floor(Math.random()* queriedItems.length);
    	if(queriedItems[index].name == "New" || queriedItems[index].name == "Ambient" || queriedItems[index].name == "Jazz"){
    		this.music = true;
    	}
    	else{
    		this.pic = true;
    	}
    	this.reward.src = this.sanitizer.bypassSecurityTrustResourceUrl(queriedItems[index].src); 
    	console.log(queriedItems[index].name);
    });
  }


  getMessgae(){
  console.log("meessage");
  	var userId = firebase.auth().currentUser.uid;
  	var messageObservable = this.af.database.list('/messages', {
      query: {
        orderByChild: 'uid',
        equalTo: userId
      }
    });

    messageObservable.subscribe(queriedItems =>{
    	var index = Math.floor(Math.random()* queriedItems.length);
    	this.message = true;
    	this.reward.message = "Message for you from "+queriedItems[index].name+ " \""+ queriedItems[index].message+"\"";
    	console.log(this.reward.message);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardDisplayPage');
  }

}

