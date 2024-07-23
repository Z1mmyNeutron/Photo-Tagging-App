import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FieldComponent } from './field/field.component';
const routes: Routes = [
  { path: '', redirectTo: '/field/new', pathMatch: 'full' },

  { path: 'field/:id', component: FieldComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}