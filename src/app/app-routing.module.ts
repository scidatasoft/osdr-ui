import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'app/core/services/auth/auth-guard.service';
import { AuthProfileGuard } from 'app/core/services/auth/auth-profile-guard.guard';
import { CapabilitiesGuard } from './core/services/guards/capabilities.guard';
import { environment } from 'environments/environment';
import { LabwizComponent } from './views/labwiz/labwiz.component.';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './views/home-page/home-page.module#HomePageModule' },
  { path: 'about', loadChildren: './views/about-page/about-page.module#AboutPageModule' },
  {
    path: 'organize/:id',
    loadChildren: './views/organize-view/organize-view.module#OrganizeViewModule',
    canActivate: [AuthGuardService, AuthProfileGuard, CapabilitiesGuard],
    data: { active: environment.capabilities.login },
  },
  {
    path: 'model',
    loadChildren: './views/file-view/file-view.module#FileViewModule',
  },
  {
    path: 'file',
    loadChildren: './views/file-view/file-view.module#FileViewModule',
  },
  {
    path: 'record',
    loadChildren: './views/record-view/record-view.module#RecordViewModule',
  },
  {
    path: 'labwiz',
    loadChildren: './views/labwiz/labwiz.module#LabWizModule',
    canActivate: [CapabilitiesGuard],
    data: { active: environment.capabilities.labwiz },
  },
  {
    path: 'predict',
    loadChildren: './views/prediction/prediction.module#PredictionModule',
    canActivate: [CapabilitiesGuard],
    data: { active: environment.capabilities.ssp },
  },
  {
    path: 'features',
    loadChildren: './views/features/features.module#FeaturesModule',
    canActivate: [CapabilitiesGuard],
    data: { active: environment.capabilities.fvc },
  },
  {
    path: '404',
    loadChildren: './views/errors/404/error-404.module#Error404Module',
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
