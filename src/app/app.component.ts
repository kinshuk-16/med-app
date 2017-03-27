import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pagesTop: Array<{title: string, component: any}>;
  pagesBottom: Array<{title: string, component: any}>;
  today: {title: string, component: any};
  constructor(public platform: Platform) {
    this.initializeApp();
    var d =new Date();
    var today = d.toDateString();
    // used for an example of ngFor and navigation
    this.today = { title: 'Today: '+today, component: Page1 };
    this.pagesTop = [
      { title: 'Medicine cabinet', component: Page2 },
      { title: 'Manage Support Group', component: Page2 },
      { title: 'Manage Rewards', component: Page2 },
      { title: 'Generate Report', component: Page2 }
    ];
    this.pagesBottom = [
      { title: 'Settings', component: Page2 },
      { title: 'logout', component: Page2 }
    ];

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
    this.nav.setRoot(page.component);
  }
}
