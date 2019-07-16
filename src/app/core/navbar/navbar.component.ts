import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { User } from 'oidc-client';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { environment } from 'environments/environment';

@Component({
  selector: 'dr-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  url: string;
  routes = [
    {
      name: 'Home',
      path: 'home',
      visible: () => true,
    },
    // {
    //   name: 'Predict',
    //   path: '/predict',
    //   visible: () => true
    // },
    // {
    //   name: 'Compute Features',
    //   path: '/features',
    //   visible: () => true
    // },
    {
      name: 'Organize',
      path: 'organize/drafts',
      visible: () => this.user,
    },
    {
      name: 'About',
      path: 'about',
      visible: () => true,
    },
  ];
  @ViewChild('profileMenu') public profileMenu: ContextMenuComponent;
  user: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private contextMenuService: ContextMenuService,
    public notificationService: NotificationsService,
  ) {
    this.auth.getUser().subscribe(user => (this.user = user));
    this.url = router.url;
  }

  ngOnInit() {}

  getRoutes() {
    return this.routes.filter(x => x.visible());
  }

  login(e: { preventDefault: () => void; }) {
    e.preventDefault();
    this.auth.login();
  }

  logout(e: { event: { preventDefault: () => void; }; }) {
    e.event.preventDefault();
    this.auth.logout();
  }

  public onContextMenu($event: MouseEvent): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.profileMenu,
      event: $event,
      item: null,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  onShowNotificationsBar($event: { preventDefault: () => void; stopPropagation: () => void; }) {
    this.notificationService.showNotificationBar();
    $event.preventDefault();
    $event.stopPropagation();
  }

  isNotificationVisible(): boolean {
    return (
      this.user &&
      this.router.url.indexOf('/home') &&
      this.router.url.indexOf('/about') < 0
    );
  }

  isLoginVisible(): boolean {
    return !this.user && environment.capabilities.login;
  }
}
