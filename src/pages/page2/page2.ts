import { Component } from '@angular/core';
import { NavController, NavParams,  ActionSheetController, Platform, ModalController, ViewController  } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AddMedPage } from '../add-med/add-med';
import firebase from 'firebase';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  //meds: any [];
  meds: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, 
    public platform: Platform, public modalCtrl: ModalController, public af: AngularFire) {
    // Get med DB reference by query
    var userId = firebase.auth().currentUser.uid;
    this.meds = af.database.list('/meds', {
      query: {
        orderByChild: 'user',
        equalTo: userId
      }
    });

    // this.meds.subscribe(queriedItems => {
    //   console.log(queriedItems);  
    // });
    
  }


  public addMed(){
    this.navCtrl.push(AddMedPage);
  }


  public openMenu(med){
    let actionSheet = this.actionSheetCtrl.create({
      title: med.name,
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.meds.remove(med.id);
            console.log('Delete clicked');
          }
        },
        {
          text: 'Details',
          icon: !this.platform.is('ios') ? 'clipboard' : null,
          handler: () => {
            console.log('Details clicked');
            let detailModal = this.modalCtrl.create(DetailsPage, { value: med });
            detailModal.present();
          }
        },
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'md-create' : null,
          handler: () => {
            console.log('edit clicked');
            this.navCtrl.push(AddMedPage,{
              medicine: med
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

}

// Detail page -- Modal


@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
      <div class="nav-bar">
        Details
      </div>
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <div class="nav-bar">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </div>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
      <ion-item>
        <ion-avatar item-left>
          <img src="{{medicine.shape}}">
        </ion-avatar>
        <h2>{{medicine.name}}</h2>
      </ion-item>

      <ion-item>
          Time
        <ion-note item-right>
          {{times}}
        </ion-note>
      </ion-item>

      <ion-item>
          Days of week
        <ion-note item-right>
          {{days}}
        </ion-note>
      </ion-item>

      <ion-item>
          No of days in course
        <ion-note item-right>
          {{medicine.noDays}}
        </ion-note>
      </ion-item>

      <ion-item>
          No of days taken
        <ion-note item-right>
          {{medicine.daysDone}}
        </ion-note>
      </ion-item>

      <ion-item>
          Reminder sound
        <ion-note item-right>
          {{medicine.sound}}
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class DetailsPage {
  medicine : any;
  times: String;
  days: String;
 constructor(params: NavParams, public viewCtrl: ViewController) {
   
   this.medicine = params.get('value');
   this.times = "";
   this.days = "";
   for(let t of this.medicine.medtime){
     this.times += t.time +" "
   }
   for(let d of this.medicine.days){
     this.days += d +" "
   }
   console.log(this.medicine);
 }

 dismiss() {
    this.viewCtrl.dismiss();
  }

}

