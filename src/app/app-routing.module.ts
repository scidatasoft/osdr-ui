import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'app/core/services/auth/auth-guard.service';
import { AuthProfileGuardGuard } from 'app/core/services/auth/auth-profile-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './views/home-page/home-page.module#HomePageModule' },
  { path: 'about', loadChildren: './views/about-page/about-page.module#AboutPageModule' },
  {
    path: 'organize/:id',
    loadChildren: './views/organize-view/organize-view.module#OrganizeViewModule',
    canActivate: [AuthGuardService, AuthProfileGuardGuard]
  },
  {
    path: 'model',
    loadChildren: './views/file-view/file-view.module#FileViewModule'
  },
  {
    path: 'file',
    loadChildren: './views/file-view/file-view.module#FileViewModule'
  },
  {
    path: 'record',
    loadChildren: './views/record-view/record-view.module#RecordViewModule'
  },
  // {
  //   path: 'predict',
  //   loadChildren: './views/prediction/prediction.module#PredictionModule'
  // },
  {
    path: 'features',
    loadChildren: './views/features/features.module#FeaturesModule'
  },
  {
    path: '404',
    loadChildren: './views/errors/404/error-404.module#Error404Module'
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
