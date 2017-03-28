import { Component } from '@angular/core';

import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { LocalNotifications } from 'ionic-native';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
   meds: any [];
   today: String;
   nextId: Number;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public platform: Platform, 
    public alertCtrl: AlertController ) {
    //binding event of local notification

    LocalNotifications.on("click", (notification) => {
        this.notificationResponse(notification.data);
        //this.notificationResponse({});
    });

  	//var addedMed = navParams.get('newMed');
    // meds Object
  	var d =new Date();
  	this.today = d.toDateString();
    this.meds =[];
    this.meds.push({
    	id:1,
    	name: "Advil",
    	time: "8:00",
    	qty: "1",
    	shape:"assets/img/capsule.png", 
      color :"white",
      taken: false
    });
    this.meds.push({
    	id:2,
    	name: "Ibuprofen",
    	time: "15:35",
    	qty: "1",
    	shape:"assets/img/pill_round.png",
      color :"white",
      taken: false
    });
    this.meds.push({
    	id:3,
    	name: "Advil",
    	time: "19:11",
    	dosage:"180mg",
    	qty: "1",
    	shape:"assets/img/capsule.png",
      color :"white",
      taken: false
    });
    this.meds.push({
      id:2,
      name: "Ibuprofen",
      time: "19:11",
      qty: "1",
      shape:"assets/img/pill_round.png",
      color :"white",
      taken: false
    });
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

    // set notification
    this.scheduleNotification();

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
              not.data += " " + med.name+ "-"+ med.time; 
              flag = true;
            }
        }
        if(!flag){
          notificationObj.push({
            title: "Hearth",
            at: medT,
            text: "Time for "+ med.name,
            sound: 'file://audio/Seashore.wav',
            data: med.name+ "-"+ med.time
          });
        }
        flag = false;
      }
    //} // uncomment when testing done. Used to limit notification only to the ones eft in the day
    console.log(notificationObj);
    LocalNotifications.schedule(notificationObj);
    // does not create notification for ibuprofen in the middle
  }

  notificationResponse(notifData){
      var medInfo=notifData.split(" ");
      var allMeds = "";
      var medData = [];
      for(let m of medInfo){
        medData.push(m.split("-"));
        allMeds += " "+ m.split("-")[0];
      }
      let alert = this.alertCtrl.create({
              title: "Hearth",
              message: "Did you take your"+ allMeds +" today?" ,
              buttons: [
                {
                    text: 'No'
                },
                {
                    text: 'Yes! Unlock my reward!',
                    handler: () => {
                        for(let item of medData){
                          for(let med of this.meds){
                            if(item[0] == med.name && item[1] == med.time){
                              med.taken = true;
                              med.color = this.getMedStatus(med);
                            }
                          }
                        }
                        // unloackReward();
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
    console.log(rTime);
    var h = Math.floor(rTime/60);
    var m = rTime - h* 60;
    return h+":"+m;
  }

  taken(med){
     //console.log(med.name);
     let index = this.meds.indexOf(med);
     this.meds[index].taken = true;
     this.meds[index].color = this.getMedStatus(med);
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


}
