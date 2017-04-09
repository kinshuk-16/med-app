import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { TestPage } from '../pages/test/test';
import { LoginPage } from '../pages/login/login';
import { AuthData } from '../providers/auth-data';
import { RewardPage } from '../pages/reward/reward';
import { SupportPage } from '../pages/support/support';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pagesTop: Array<{title: string, component: any}>;
  pagesBottom: Array<{title: string, component: any}>;
  today: {title: string, component: any};
  zone: NgZone;

  constructor(public platform: Platform, public authData: AuthData,) {
    //this.rootPage = Page1;

    this.zone = new NgZone({});
    firebase.initializeApp({
      apiKey: "AIzaSyB4qaoWAQWCeUuPJ7aIlFwWy9VJXL-I_xM",
      authDomain: "medapp-6f685.firebaseapp.com",
      databaseURL: "https://medapp-6f685.firebaseio.com",
      projectId: "medapp-6f685",
      storageBucket: "medapp-6f685.appspot.com",
      messagingSenderId: "535630967883"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run( () => {
        //console.log(user);
        if (!user) {
          this.rootPage = LoginPage;
          //console.log("here 1");
          unsubscribe();
        } else { 
          this.rootPage = Page1;
          //console.log("here 2");
          unsubscribe();
        }
      });     
    });
    
    this.initializeApp();
    var d =new Date();
    var today = d.toDateString();
    // used for an example of ngFor and navigation
    this.today = { title: 'Today: '+today, component: Page1 };
    this.pagesTop = [
      { title: 'Medicine cabinet', component: Page2 },
      { title: 'Manage Support Group', component: SupportPage  },
      { title: 'Manage Rewards', component: RewardPage },
      { title: 'Generate Report', component: Page2 }
      //{ title: 'Test', component: TestPage } // only for development/debugging -- remove later
    ];
    this.pagesBottom = [
      //{ title: 'Settings', component: Page2 },
      { title: 'Logout', component: Page2 }
    ];
    console.log("here"+ this.rootPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //console.log(page);
    if(page.title == "Logout"){
      this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
      });
    }
    else{
      this.nav.setRoot(page.component);
    }
    
  }
}
