import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditcardPage } from './creditcard.page';

const routes: Routes = [
  {
    path: '',
    component: CreditcardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditcardPageRoutingModule {}
