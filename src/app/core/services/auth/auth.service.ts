import { Injectable, NgZone } from '@angular/core';
import { User, UserManager } from 'oidc-client';
import { environment } from 'environments/environment';
import { Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


// Log.logger = console;
// Log.level = Log.DEBUG;

@Injectable()
export class AuthService {
  static user_test_id = 'b04e0ffb-4156-411a-8e5a-5b28c6c25e7c';
  static _debug = false;

  appServer = window.location.protocol + '//' + window.location.host;

  settings: any = {
    authority: environment.identityServerUrl,
    client_id: 'leanda_angular',
    redirect_uri: this.appServer + '/auth.html',
    silent_redirect_uri: this.appServer + '/silent-renew.html',
    post_logout_redirect_uri: this.appServer,
    response_type: 'id_token token',
    scope: 'openid profile email',

    automaticSilentRenew: true,

    monitorSession: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
  };

  notificationTokenExpiring: Subject<any> = new Subject();
  jwtHelper: JwtHelperService = new JwtHelperService();

  manager: UserManager = null;

  user: User;
  loggedIn = false;

  constructor(private http: HttpClient,
    public ngZone: NgZone) {
    this.ngZone.runOutsideAngular(
      () => {
        this.manager = new UserManager(this.settings);
        this.manager.getUser().then(
          (user) => {
            if (user) {
              this.user = user;
              this.loadUserSettings(user);
            } else {
              this.loggedIn = false;
              this.user = null;
            }
          }
        ).catch(
          (err) => {
            this.ngZone.run(
              () => {
                this.loggedIn = false;
              }
            );
          }
        );

        this.manager.events.addUserLoaded(user => this.loadUserSettings(user));

        this.manager.events.addUserSignedOut((data) => {
          console.log('addUserSignedOut', data);
          this.startSignout();
        });

        this.manager.events.addSilentRenewError((data) => {
          console.log('addSilentRenewError', data);
          this.silentSignIn();
        });

        this.manager.events.addAccessTokenExpired(
          () => {
            console.log('addAccessTokenExpired');
            this.silentSignIn();
          }
        );
      }
    );
  }

  silentSignIn() {
    this.manager.signinSilent().then(
      (userInformation) => {
      },
      (error) => {
        console.log('signinSilent error - ', error);
        this.startSignin();
      }
    ).catch(
      (error) => {
        console.log('signinSilent error - ', error);
        this.startSignin();
      }
    );
  }

  loadUserSettings(user) {
    this.ngZone.runOutsideAngular(
      () => {
        if (user) {
          this.loggedIn = true;
          this.user = user;

          this.askAboutProfile(user.profile).subscribe(
            (response: Response) => {
            },
            (error) => {
              if (AuthService._debug) {
                const url = `${environment.apiUrl}/users/${AuthService.user_test_id}`;
                this.createUserProfile(user.profile, url);
              } else {
                this.createUserProfile(user.profile);
              }
            }
          );
        }
        this.user.profile = this.jwtHelper.decodeToken(user.access_token);
      }
    );
  }

  startSignin() {
    this.ngZone.runOutsideAngular(
      () => {
        this.manager.signinRedirect({ data: localStorage.getItem('redirectUrl') }).then(() => {
          console.log('signinRedirect done');
        }).catch(function (err) {
          console.log(err);
        });
      }
    );
  }

  getUser() {
    return this.ngZone.runOutsideAngular(() => {
      return from(
        this.manager.getUser().then((user) => {
          // console.log('got user', user);
          return user;
        }).catch(function (err) {
          console.log(err);
          return null;
        })
      ).pipe(
        map(
          (user) => {
            if (user) {
              user.profile = this.jwtHelper.decodeToken(this.user.access_token);
              this.user.profile = user.profile;
              return user;
            }
          }
        ));
    });
  }

  login() {
    this.startSignin();
  }

  startSignout() {
    this.manager.signoutRedirect().then(function (resp) {
      console.log('signed out', resp);
    }).catch(function (err) {
      console.log(err);
    });
  }

  logout() {
    this.startSignout();
  }

  askAboutProfile(userProfile) {
    // just for test user profile put here new guid
    let url = '';
    if (AuthService._debug) {
      url = `${environment.apiUrl}/users/${AuthService.user_test_id}`;
    } else {
      url = `${environment.apiUrl}/users/${userProfile.sub}`;
    }

    url = encodeURI(url);

    return this.http.get(url);
  }

  createUserProfile(userProfile: any, inputUrl?: string) {
    // TODO change it if profile exists to prevent destroy profile
    let url = '';

    // it was made for testing functionality
    if (inputUrl) {
      url = inputUrl;
    } else {
      url = `${environment.apiUrl}/users/${userProfile.sub}`;
      url = encodeURI(url);
    }

    let displayName = userProfile.given_name ? userProfile.given_name : '';
    displayName += userProfile.family_name ? ' ' + userProfile.family_name : '';

    const profileObject = {
      DisplayName: displayName,
      LastName: userProfile.family_name || '',
      FirstName: userProfile.given_name || '',
      Email: userProfile.email || '',
      Avatar: '',
      LoginName: userProfile.preferred_username
    };
    this.http.put(url, profileObject).subscribe(
      (response: Response) => {
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
