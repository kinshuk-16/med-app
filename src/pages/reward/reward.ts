import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire, public alertCtrl: AlertController) {

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
  			pic: "assets/img/jazz.png",
        src: "https://www.youtube.com/embed/clC6cgoh1sU"
  		},
  		{
  			name: "Ambient",
  			pic: "assets/img/ambient.png",
        src: "https://www.youtube.com/embed/QhZnEagfjTQ"
  		},
  		{
  			name: "New",
  			pic: "assets/img/new.png",
        src: "https://www.youtube.com/embed/5xtm0iRTWEE"
  		}]
  	});
  	this.catagories.push({
  		name: "Comic Strips",
  		subCats:[{
  			name: "XKCD",
  			pic: "assets/img/xkcd.png",
        src: "assets/img/xkcdShow.png"
  		},
  		{
  			name: "Dilbert",
  			pic: "assets/img/dilbert.png",
        src: "assets/img/db.gif"
  		},
  		{
  			name: "Garfield",
  			pic: "assets/img/garfield.png",
        src: "assets/img/gf.gif"
  		}]
  	});
  	this.catagories.push({
  		name: "Animal Pictures",
  		subCats:[{
  			name: "Cats",
  			pic: "assets/img/cats.png",
        src: "assets/img/catShow.jpg"
  		},
  		{
  			name: "Dogs",
  			pic: "assets/img/dogs.png",
        src: "assets/img/dogShow.jpg"
  		},
  		{
  			name: "Wild",
  			pic: "assets/img/wild.png",
        src: "assets/img/wildShow.jpg"
  		}]
  	});
  	this.catagories.push({
  		name: "Vacation",
  		subCats:[{
  			name: "Urban",
  			pic: "assets/img/urban.png",
        src: "assets/img/urbanShow.jpg"
  		},
  		{
  			name: "Beach",
  			pic: "assets/img/beach.png",
        src: "assets/img/beachShow.jpg"
  		},
  		{
  			name: "wilderness",
  			pic: "assets/img/wilderness.png",
        src: "assets/img/wildernessShow.jpg"
  		}]
  	});
  }

  addToFav(catagory){
  	var uniqueId = this.userId+"-"+catagory.name;
  	this.af.database.object("rewards/"+ uniqueId).set({
  		name: catagory.name,
  		uid: this.userId,
  		pic: catagory.pic,
      src: catagory.src
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

  info(){
    console.log("info cicked");
    let confirm = this.alertCtrl.create({
      title: 'About Reward Page',
      subTitle: `Add reward catagory to your favourite by tapping on them. You would get a reward from one of your favourite catagories (chosen randomly) 
      on taking a medicine.`,
      buttons: ['OK']
    });
    confirm.present();
  }

}
