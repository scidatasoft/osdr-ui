import { ComponentPortal } from '@angular/cdk/portal';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';
import { NotificationType } from 'app/shared/components/notifications/events.model';
import { NotificationItem, NotificationMessage } from 'app/shared/components/notifications/notifications.model';
import { environment } from 'environments/environment';
import { Subscription, interval } from 'rxjs';

import { FvcHomeComponent } from './distributions/fvc/fvc.component';
import { LabwizHomeComponent } from './distributions/labwiz/labwiz.component';
import { LeandaHomeComponent } from './distributions/leanda/leanda.component';
import { HomePageService } from './home-page.service';

@Component({
  selector: 'dr-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  selectedPortal: ComponentPortal<Component | OnInit>;
  title = 'Checking profile ...';
  userLogin = false;
  wasShown = false;

  private checkProfile: Subscription;
  constructor(
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone,
    private notificationService: NotificationsService,
    private pageTitle: PageTitleService,
    private service: HomePageService,
  ) {
    pageTitle.title = 'Home';
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.setComponent();
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
  }

  private setComponent() {
    const mockDistribution = environment.distribution;
    switch (mockDistribution.code) {
      case 'labwiz':
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<LabwizHomeComponent>(LabwizHomeComponent);
        break;
      case 'fvc':
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<FvcHomeComponent>(FvcHomeComponent);
        break;
      default:
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<LeandaHomeComponent>(LeandaHomeComponent);
        break;
    }
  }
}
