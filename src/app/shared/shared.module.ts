import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { CustomInputComponent } from './componentes/custom-input/custom-input.component';
import { LogoComponent } from './componentes/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './componentes/add-update-product/add-update-product.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateProductComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    LogoComponent,
    AddUpdateProductComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
