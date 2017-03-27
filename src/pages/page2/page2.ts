import { Component } from '@angular/core';

import { NavController, NavParams,  ActionSheetController, Platform, ModalController, ViewController  } from 'ionic-angular';

import { AddMedPage } from '../add-med/add-med';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  meds: any [];
  loadProgress: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, 
    public platform: Platform, public modalCtrl: ModalController) {
    var addedMed = navParams.get('newMed');
    this.loadProgress = 50;
     this.meds =[];
    this.meds.push({
      id:1,
      name: "Advil",
      qty: "1",
      icon:"icon.png",
      times: "one",
      medtime: [{time: "07:00"}],
      days: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
      sound: "seashore",
      noDays: 7,
      daysDone: 2,
      shape: "assets/img/capsule.png"
    });
    this.meds.push({
      id:2,
      name: "Ibuprofen",
      qty: "1",
      icon:"icon.png",
      times: "one",
      medtime: [{time: "07:00"}],
      days: ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"],
      sound: "seashore",
      noDays: 14,
      daysDone: 1,
      shape: "assets/img/pill_round.png"
    });
   
    if(addedMed){
      console.log("here");
      this.meds = this.meds.concat(addedMed);
      console.log(this.meds);
      if(navParams.get('edit')){
          let index = -1;
          for(let i=0; i< this.meds.length; i++){
            if(this.meds[i].id == addedMed.id){
              index = i;
              break;
            }
          }
          this.meds.splice(index,1);
      }
    }
  }
  public getNextId(){
    var max = -1;
    for(let med of this.meds ){
      if(med.id> max){
        max = med.id;
      }
    }
    return max +1;
  }

  public addMed(){

    this.navCtrl.push(AddMedPage,{
      nextId: this.getNextId()
    });
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
            let index = this.meds.indexOf(med);
            this.meds.splice(index,1);
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
          Quantity per time
        <ion-note item-right>
          {{medicine.qty}}
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

