import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//pages
import { Page1 } from '../pages/page1/page1';
import { Page2, DetailsPage } from '../pages/page2/page2';
import { AddMedPage } from '../pages/add-med/add-med';
import { TestPage } from '../pages/test/test';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { EpicPage } from '../pages/epic/epic';
import { RewardPage } from '../pages/reward/reward';
import { RewardDisplayPage } from '../pages/reward-display/reward-display';
import { SupportPage, SearchPage } from '../pages/support/support';
import { SettingsPage } from '../pages/settings/settings';
import { ReportPage } from '../pages/report/report';

//component
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

//providers
import { AuthData } from '../providers/auth-data';


// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

 
// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyB4qaoWAQWCeUuPJ7aIlFwWy9VJXL-I_xM",
  authDomain: "medapp-6f685.firebaseapp.com",
  databaseURL: "https://medapp-6f685.firebaseio.com",
  storageBucket: "medapp-6f685.appspot.com",
  messagingSenderId: "535630967883"
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    AddMedPage,
    DetailsPage,
    ProgressBarComponent,
    LoginPage,
    SignupPage,
    EpicPage,
    RewardPage,
    RewardDisplayPage,
    SupportPage,
    SearchPage,
    SettingsPage,
    ReportPage,
    TestPage ///just to test out functionalities
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig) // added for firebase
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    AddMedPage,
    DetailsPage,
    LoginPage,
    SignupPage,
    EpicPage,
    RewardPage,
    RewardDisplayPage,
    SupportPage,
    SearchPage,
    SettingsPage,
    ReportPage,
    TestPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthData]
})
export class AppModule {}
