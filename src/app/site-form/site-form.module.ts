import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFormRoutingModule } from './site-form-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from '../shared-module/shared-module.module';
import { SurveyComponent } from './survey/survey.component';
import { DescriptionComponent } from './description/description.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [MainPageComponent, SurveyComponent, DescriptionComponent, FooterComponent],
  imports: [
    CommonModule,
    SiteFormRoutingModule,
    SharedModule
  ]
})
export class SiteFormModule { }
