import { Component } from '@angular/core';

import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { LocalNotifications } from 'ionic-native';
import { AngularFire /*, FirebaseListObservable*/ } from 'angularfire2';

import {Subject} from 'rxjs/Subject';
import { AddMedPage } from '../add-med/add-med';
import { EpicPage } from '../epic/epic';
import { RewardDisplayPage } from '../reward-display/reward-display';

import firebase from 'firebase';

declare var window: any;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
   meds: any [];
   today: String;
   nextId: Number;
   allMeds : any [];
   noMeds: boolean;
   userId: string;
   stop: boolean;
  constructor(public navCtrl: NavController,  public navParams: NavParams, public platform: Platform, 
    public alertCtrl: AlertController, public af: AngularFire ) {
    this.stop = false;
    //binding event of local notification
    LocalNotifications.on("click", (notification) => {
        this.notificationResponse(notification.data);
    });

    //define today
    var d =new Date();
    this.today = d.toDateString();


    //query value for this user
    const subject = new Subject();

    const queryObservable = af.database.list('/meds', {
      query: {
        orderByChild: 'user',
        equalTo: subject
      }
    });
    //this.allMeds =[];
    queryObservable.subscribe(queriedItems => {
      if(!this.stop){
        this.allMeds = [];
        queriedItems.forEach(medObj => {
          this.allMeds.push(medObj);
        });
        this.prepareMedsObject();
        if(this.meds.length === 0){
          this.noMeds = true;
        }
        else{
          this.noMeds = false;
        }
        this.scheduleNotification();
      } 
      });

    
    this.userId = firebase.auth().currentUser.uid;
    subject.next(this.userId);
    

  }

  public prepareMedsObject(){
    //console.log(this.allMeds);
    this.meds =[];
    
    for(let m of this.allMeds){
      var lastD = new Date(m.lastDay);
      if(lastD <= new Date()){
        //remove from current table
        this.af.database.list('/meds').remove(m.id);
        //add to History table
        this.af.database.object("medsHistory/"+ m.id).set(m);
        continue;
      }
      // determine taken or not
      

      for(let i=0 ; i<m.medtime.length; i++){
        var took = false;
        for(let prop in m.taken){
          var today = new Date(m.taken[prop].date);
          if(m.taken[prop].date == today.toDateString()){
            if(m.taken[prop].time == m.medtime[i].time){
              took = true;
            }
          }
        }
        var medObj = {
          id: m.id,
          name: m.name,
          time: m.medtime[i].time,
          shape: m.shape,
          color :"white",
          taken: took,
          sound: m.sound,
          support: m.support,
          reward: m.reward
        }
        this.meds.push(medObj);
      }
    }
    // sort meds object before display
    this.meds.sort(function(obj1, obj2){
      var medTime1 = parseInt(obj1.time.split(":")[0])*60 +parseInt(obj1.time.split(":")[1]);
      var medTime2 = parseInt(obj2.time.split(":")[0])*60 +parseInt(obj2.time.split(":")[1]);
      return medTime1 -medTime2;
    });

    // set color of all the objects based on time
    for(let med of this.meds){
        med.color = this.getMedStatus(med);
    }
    console.log(this.meds);
  }

  public scheduleNotification(){
    LocalNotifications.cancelAll();
    var flag =false;
    var notificationObj = [];
    for(let med of this.meds){
        var medT = new Date();
        medT.setHours(parseInt(med.time.split(":")[0]));
        medT.setMinutes(parseInt(med.time.split(":")[1]));
        //if(new Date()< medT){
          for(let not of notificationObj){
            if(not.at.getHours() == medT.getHours() && not.at.getMinutes() == medT.getMinutes()){
              not.text += ", " + med.name;
              not.data += "**" + med.id 
              flag = true;
            }
        }
        if(!flag){
          //var sound
          
          var sound = "";
          if(med.sound == ""){
            sound = "";
          }
          else if(med.sound == "Default"){
            sound = "res://platform_default";
          }
          else{
            sound = "file://audio/"+med.sound+".wav"
          }
          //console.log(sound); 
          notificationObj.push({
            title: "Hearth",
            at: medT,
            text: "Time for "+ med.name,
            sound: sound,
            data: med.id
          });
        }
        flag = false;
      }
    //} // uncomment when testing done. Used to limit notification only to the ones eft in the day
    //console.log(notificationObj);
    LocalNotifications.schedule(notificationObj);
    // does not create notification for ibuprofen in the middle
  }
  updateTakenDb(med){
      //var taken = [];
      //var timesTaken = 0;
      var d = new Date();
      var ds = d.toDateString();
      this.af.database.list('/meds/'+med.id+'/taken').push({
        date: ds,
        time: med.time
      });
      console.log("outside");
      //console.log(taken);
  }

  sendMessage(ids){
    var send = true;
    for(let id of ids){
      for(let med of this.meds){
        if(med.id == id){
          if(med.support ==false){
            send = false;
          }
        }
      }
    }
    //alert(send);
    if(send){
      var queryObservable = this.af.database.list('/support', {
      query: {
        orderByChild: 'uid',
        equalTo: this.userId
      }
    });
    //alert("here");
    var num = "";
    queryObservable.subscribe(queriedItems => {
      //alert(JSON.stringify(queriedItems));
        queriedItems.forEach(person =>{
          if(person.default){
            num = person.number;
            //alert(person.name);
          }
        });
        if(num!= ""){
          var message ="Oh no! I missed my medicine today! Help keep me on track.";
          if(window.SMS) window.SMS.sendSMS(num,message,()=>{;},(error)=>{;});
        }
       });
    }
  }

  notificationResponse(notifData){
      var medIds=notifData.split("**");
      var allMeds = "";
      for(let mId of medIds){
        for(let m of this.meds){
          if(m.id == mId){
            allMeds += " "+ m.name;
          }
        }  
      }
      let alert = this.alertCtrl.create({
              title: "Hearth",
              message: "Did you take your"+ allMeds +" today?" ,
              buttons: [
                {
                    text: 'No',
                    handler: () =>{
                      this.sendMessage(medIds);
                    }
                },
                {
                    text: 'Yes! Unlock my reward!',
                    handler: () => {
                        this.stop = true
                        var medicines = [];
                        for(let mId of medIds){
                            for(let m of this.meds){
                              if(m.id == mId){
                                m.taken = true;
                                m.color = this.getMedStatus(m);
                                this.updateTakenDb(m);
                                medicines.push(m)
                              }
                            }  
                          }
                        this.navCtrl.push(RewardDisplayPage,{
                                 medicine: medicines
                               });
                    }
                }
            ]
          });
          alert.present()
  }

  getMedStatus(med){
    if(med.taken){
      return "#66bb6a"; //green
    }
    else{
      var medTime = parseInt(med.time.split(":")[0])*60 +parseInt(med.time.split(":")[1]);
      var d = new Date();
      var nowTime = d.getHours() * 60 + d.getMinutes();
      if (nowTime > medTime){
        return "#ef5350"; //red
      }
      else{
        return "white";
      }
    }  
  }

  addTime(aTime,Otime){ // will cause a bug if the time exceeds 24 hr. Not worrying about that right now
    var medTime = parseInt(Otime.split(":")[0])*60 +parseInt(Otime.split(":")[1]);
    var rTime = medTime + parseInt(aTime);
    //console.log(rTime);
    var h = Math.floor(rTime/60);
    var m = rTime - h* 60;
    return h+":"+m;
  }

  taken(med){
     //console.log(med.name);
     let index = this.meds.indexOf(med);
     this.meds[index].taken = true;
     this.meds[index].color = this.getMedStatus(med);
     this.updateTakenDb(med);
     this.navCtrl.push(RewardDisplayPage);
  }

  snooze(med){
    let prompt = this.alertCtrl.create({
            title: 'Snooze time',
            inputs: [{
                      type: 'radio',
                      label: '5 min',
                      value: '5',
                      checked: true
                    },
                    {
                      type: 'radio',
                      label: '10 min',
                      value: '10'
                    },
                    {
                      type: 'radio',
                      label: '30 min',
                      value: '30'
                    },
                    {
                      type: 'radio',
                      label: '1 hr',
                      value: '60'
                    }],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Set',
                    handler: data => {
                        let index = this.meds.indexOf(med);
                         //console.log(data);
                         this.meds[index].time = this.addTime(data,this.meds[index].time);
                         this.scheduleNotification();
                    }
                }
            ]
        });
 
        prompt.present(); 
  }

  addMed(){
    this.navCtrl.push(AddMedPage);
  }

  opneEpic(){
    this.navCtrl.push(EpicPage);
  }


}
