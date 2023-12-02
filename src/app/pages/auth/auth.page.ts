import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],

})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  fireBaseSvc = inject(FirebaseService)
  AlertControl = inject(AlertController)
  router = inject(Router)

  ngOnInit() {
  }

  submit() {
    if(this.form.valid){
      this.fireBaseSvc.signIn(this.form.value as User).then(res => {
        this.getUserInfo(res.user.uid);
      }).catch(error => {
        console.log(error.message);
        this.Alert();
      })
    }
  }

  goToSignUp() {
    this.router.navigateByUrl('sign-up');
  }

  async Alert(){
    const alert = await this.AlertControl.create({
      header: 'Error',
      subHeader: 'Email o contraseña incorrectos',
      message: 'Validar credenciales',
      buttons: ['OK']
    });

    await alert.present();
  }

  async Welcome(user: string){
    const alert = await this.AlertControl.create({
      header: 'Ingreso exitoso',      
      message: `Te damos la bienvenido ${user}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.fireBaseSvc.getDocument(path).then((user:User) => {

        this.saveLocalStorage('user', user);
        this.routerLink('/home');
        this.form.reset();

        this.Welcome(user.name);

      }).catch(error => {
        console.log(error.message);
        this.Alert();
      })
    }
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}
