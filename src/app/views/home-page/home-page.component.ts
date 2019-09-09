import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';
import { NotificationType } from 'app/shared/components/notifications/events.model';
import { NotificationItem, NotificationMessage } from 'app/shared/components/notifications/notifications.model';
import { environment } from 'environments/environment';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'dr-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  buildTime: number;
  buildNumber: string;
  apiVersion: number;
  environment: string;
  private checkProfile: Subscription;
  error = false;
  profileExists = false;
  userLogin = false;
  title = 'Checking profile ...';
  wasShown = false;

  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private auth: AuthService,
    // private signalr: SignalrService,
    private ngZone: NgZone,
    private notificationService: NotificationsService,
    private http: HttpClient,
    private pageTitle: PageTitleService,
  ) {
    pageTitle.title = 'Home';
    // this.ngZone.runOutsideAngular(
    //   () => {
    //     if (window.location.hash) {
    //       auth.signInCallback();
    //       this.router.navigateByUrl('/');
    //     }
    //   }
    // );
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.checkProfile = interval(500).subscribe((i: number) => {
        if (this.auth.user) {
          this.ngZone.run(() => {
            this.userLogin = true;
            if (!this.wasShown) {
              this.wasShown = true;
              this.notificationService.showToastNotification(
                new NotificationItem(null, NotificationMessage.CreateCommonMessage(NotificationType.Info, 'Profile', this.title)),
                false,
              );
            }
          });
          this.auth.askAboutProfile(this.auth.user.profile).subscribe(
            (response: Response) => {
              this.ngZone.run(() => {
                // this.profileExists = true;
                this.checkProfile.unsubscribe();
                // this.title = 'Creating user profile ...';
              });
            },
            error => {
              console.log(error);
              if (error.status === 401) {
                this.auth.silentSignIn();
              }
            },
          );
        }

        if (i > 30) {
          if (this.auth.user) {
            this.auth.askAboutProfile(this.auth.user.profile).subscribe(
              (response: Response) => {
                this.ngZone.run(() => {
                  this.notificationService.showToastNotification(
                    new NotificationItem(null, NotificationMessage.CreateCommonMessage(NotificationType.Info, 'Profile', this.title)),
                    false,
                  );
                });
              },
              error => {
                console.log(error);
                this.ngZone.run(() => {
                  this.notificationService.showToastNotification(
                    new NotificationItem(
                      null,
                      NotificationMessage.CreateCommonMessage(
                        NotificationType.Error,
                        'Profile error',
                        'Something broke! Please contact our support team.',
                      ),
                    ),
                    false,
                  );
                });
              },
            );
          }
          this.checkProfile.unsubscribe();
        }
      });
    });

    this.getBuildData();
  }

  getBuildData() {
    this.http.get(`${environment.apiUrl}/version`).subscribe((x: any) => {
      const data = x.build;
      this.apiVersion = data.version;
    });
    /*
     * Jenkins is replacing "jenkinsBuildData.json" with its own, setting build id and time
     * For local develoment set path to './src/jenkinsBuildData.json'
     */
    this.http.get('./jenkinsBuildData.json').subscribe((res: any) => {
      const data = res.buildInfo;
      this.buildNumber = data.buildId;
      this.buildTime = data.buildDate;
      this.environment = data.environment;
    });
  }
}
