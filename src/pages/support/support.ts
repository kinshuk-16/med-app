import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, ActionSheetController, Platform } from 'ionic-angular';
import {Contacts} from 'ionic-native';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';

declare var window: any;
/*
  Generated class for the Support page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-support',
  templateUrl: 'support.html'
})
export class SupportPage {
  supportGroup: FirebaseListObservable<any>;
  userId : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
  	public af: AngularFire, public actionSheetCtrl: ActionSheetController, public platform: Platform, public alertCtrl: AlertController) {
  	this.userId = firebase.auth().currentUser.uid;

  	this.supportGroup =  af.database.list('/support', {
      query: {
        orderByChild: 'uid',
        equalTo: this.userId
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

 
  searchContact(){
  	let searchModal = this.modalCtrl.create(SearchPage);
    searchModal.present();
  }

 showOptions(contact){
  	let actionSheet = this.actionSheetCtrl.create({
      title: contact.name,
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.supportGroup.remove(this.userId+"-"+contact.name);
            console.log('Delete clicked');
          }
        },
        {
          text: 'Details',
          icon: !this.platform.is('ios') ? 'clipboard' : null,
          handler: () => {
            console.log('Details clicked');
            //alert
            let details = this.alertCtrl.create({
		      title: 'Contact',
		      message: "Name: "+contact.name+"\n Number: "+ contact.number,
		      buttons: ['OK']
		    });
		    details.present();
          }
        },
        {
          text: 'Add favourite',
          icon: !this.platform.is('ios') ? 'star' : null,
          handler: () => {
            console.log('edit clicked');
            this.af.database.object("support/"+ this.userId+"-"+contact.name+ "/default").set(true);
          }
        },
        {
          text: 'Remove favourite',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('edit clicked');
            this.af.database.object("support/"+ this.userId+"-"+contact.name+ "/default").set(false);
          }
        }
      ]
    });
    actionSheet.present();
  }

  info(){
    console.log("info cicked");
    let confirm = this.alertCtrl.create({
      title: 'About Support page',
      subTitle: `This page displays the contact in your support group. You can add new contact (from your phonebook) by clicking the plus button at the bottom of the page.
      Make a contact your favourite by clicking on the contact name and selecting "Add favourite". Favourite contact will get SMS if you miss your medication.
      Other contacts would only be able to send you encouraging messages. `,
      buttons: ['OK']
    });
    confirm.present();
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
      <button ion-button icon-only  (click)="info()">
      <div class="nav-bar">
        <ion-icon name="information-circle"></ion-icon>
      </div>
      </button>
      <button ion-button (click)="dismiss()">
        <div class="nav-bar">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </div>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content padding>
  <ion-searchbar (ionInput)="findfn(contacttobefound)" [(ngModel)]="contacttobefound"></ion-searchbar>
	   <ion-list *ngIf="found">
	       <ion-item *ngFor="let item of contactsfound" (click)="addContact(item)" >
		        <ion-icon name="add-circle" style="{font-size: 90px;}"></ion-icon>
	           {{item.displayName}}
	            
	       </ion-item>
	   </ion-list>
	   
</ion-content>
`
})
export class SearchPage {
  contacttobefound: string;
  contactsfound: any [];
  found: boolean;
  errorMessage: string;
 constructor(params: NavParams, public viewCtrl: ViewController, public af: AngularFire, public alertCtrl: AlertController) {
   this.contacttobefound = '';
    this.contactsfound = [];
    this.found = false;   
   	//this.errorMessage = "";
   console.log("In search modal");
 }

 findfn(val) {
      Contacts.find(['*'], {filter: val}).then((contacts) => {
          this.contactsfound = contacts;
          this.found = true;
          
      })
     
      
         
  }

  addContact(contact){
  	console.log(contact);
  	//var con = JSON.stringify(contact)
  	var name = contact._objectInstance.displayName;
  	//alert(JSON.stringify(contact));
  	var num = contact._objectInstance.phoneNumbers[0].value;
  	var userId = firebase.auth().currentUser.uid;
  	var contactObj = {
  		name: name,
  		number: num,
  		uid: userId,
  		default: false
  	};
  	var uniqueId = userId+"-"+name; 
  	this.af.database.object("support/"+ uniqueId).set(contactObj);

  	// SMS to the person
 	var message = "Hey there! I am using this new app to keep record of my medication regime. Help me in this endeavour by seding me some encouring or humourous messages! Thanks!";
 	//var message ="haha";

  	if(window.SMS) window.SMS.sendSMS(num,message,()=>{
       //alert("sent");
       ;
     },(error)=>{
      //alert("not sent");
      ;
     });
  	// alert

    let confirm = this.alertCtrl.create({
      title: 'Contact Added',
      subTitle: ""+name+" was added to your support group.",
      buttons: ['OK']
    });
    confirm.present();


  }

 dismiss() {
    this.viewCtrl.dismiss();
  }

  info(){
    console.log("info cicked");
    let confirm = this.alertCtrl.create({
      title: 'Add Support Contact',
      subTitle: `You can add friends and family from your contact into your support group by searching them by name in the search bar below. 
      Tap the + icon to add contact. The select contact will get a message from the app asking them to send encouranging message to you.`,
      buttons: ['OK']
    });
    confirm.present();
  }

}

