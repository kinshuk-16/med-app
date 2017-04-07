import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

/*
  Generated class for the Reward page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reward',
  templateUrl: 'reward.html'
})
export class RewardPage {
  catagories:any [];
  favCats: FirebaseListObservable<any>;;
  userId: string;
  rewards: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire) {

  	this.userId = firebase.auth().currentUser.uid;
  	
  	//console.log(this.userId);
  	this.catagories =[];
  	this.favCats =  af.database.list('/rewards', {
      query: {
        orderByChild: 'uid',
        equalTo: this.userId
      }
    });

    // this.favCats.subscribe(queriedItems => {
    //    console.log(queriedItems);  
    //  });

  	this.catagories.push({
  		name: "Music",
  		subCats:[{
  			name: "Jazz",
  			pic: "assets/img/jazz.png"
  		},
  		{
  			name: "Ambient",
  			pic: "assets/img/ambient.png"
  		},
  		{
  			name: "New",
  			pic: "assets/img/new.png"
  		}]
  	});
  	this.catagories.push({
  		name: "Comic Strips",
  		subCats:[{
  			name: "  XKCD  ",
  			pic: "assets/img/xkcd.png"
  		},
  		{
  			name: "Dilbert",
  			pic: "assets/img/dilbert.png"
  		},
  		{
  			name: "Garfield",
  			pic: "assets/img/garfield.png"
  		}]
  	});
  	this.catagories.push({
  		name: "Animal Pictures",
  		subCats:[{
  			name: "Cats",
  			pic: "assets/img/cats.png"
  		},
  		{
  			name: "Dogs",
  			pic: "assets/img/dogs.png"
  		},
  		{
  			name: "Wild",
  			pic: "assets/img/wild.png"
  		}]
  	});
  	this.catagories.push({
  		name: "Vacation",
  		subCats:[{
  			name: "Urban",
  			pic: "assets/img/urban.png"
  		},
  		{
  			name: "Beach",
  			pic: "assets/img/beach.png"
  		},
  		{
  			name: "wilderness",
  			pic: "assets/img/wilderness.png"
  		}]
  	});
  }

  addToFav(catagory){
  	var uniqueId = this.userId+"-"+catagory.name;
  	this.af.database.object("rewards/"+ uniqueId).set({
  		name: catagory.name,
  		uid: this.userId,
  		pic: catagory.pic
  	});
  }

  removeFav(catagory){
  	var uniqueId = this.userId+"-"+catagory.name;
  	//console.log(uniqueId);
  	this.af.database.list('/rewards').remove(uniqueId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardPage');
  }

}
