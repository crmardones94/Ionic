import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  fireBaseSvc = inject(FirebaseService)
  AlertControl = inject(AlertController)
  router = inject(Router)

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      this.fireBaseSvc.signUp(this.form.value as User).then(async res => {

        await this.fireBaseSvc.Updateuser(this.form.value.name);

        let uid = res.user.uid;

        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);

      }).catch(error => {
        console.log(error.message);
        this.Alert();
      })
    }
  }

  async Alert() {
    const alert = await this.AlertControl.create({
      header: 'Error',
      subHeader: 'Email o contraseña incorrectos',
      message: 'Validar credenciales',
      buttons: ['OK']
    });

    await alert.present();
  }

  async Create() {
    const alert = await this.AlertControl.create({
      header: 'Usuario Creado',
      message: 'Creacion de usuario exitosa',
      buttons: ['OK']
    });

    await alert.present();
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.fireBaseSvc.setDocument(path, this.form.value).then(async res => {

        await this.saveLocalStorage('user', this.form.value);
        this.Create();
        this.routerLink('/auth');
        this.form.reset();

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

