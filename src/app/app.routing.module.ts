import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./site-form/site-form.module').then(m => m.SiteFormModule)},

];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
