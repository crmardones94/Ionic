import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    category: new FormControl('', [Validators.required, Validators.minLength(4)]),
    brand: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  fireBaseSvc = inject(FirebaseService)
  AlertControl = inject(AlertController)
  router = inject(Router)
  user = {} as User;


  ngOnInit() {
    this.user = this.getLocalStorage('user');
  }

  async TakeImage(){
    const dataURL = (await this.takePicture('Tomar una foto')).dataUrl;
    this.form.controls.image.setValue(dataURL);
  }

  async submit() {
    if (this.form.valid) {

      //let path = `users/${this.user.uid}/products`
      let path = `products`
      let dataURL = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`
      let imageURL = await this.fireBaseSvc.uploadImage(imagePath, dataURL);
      this.form.controls.image.setValue(imageURL);

      delete this.form.value.id;

      this.fireBaseSvc.addDocument(path, this.form.value).then(async res => {

        this.Create();
        await this.routerLink('/home');


      }).catch(error => {
        console.log(error.message);
        this.Alert();
      })
    }
  }

  async Alert() {
    const alert = await this.AlertControl.create({
      header: 'Error',
      subHeader: 'Algunos campos no son validos',
      message: 'Validar campos',
      buttons: ['OK']
    });

    await alert.present();
  }

  async Create() {
    const alert = await this.AlertControl.create({
      header: 'Producto Creado',
      message: 'Producto creado con exito',
      buttons: ['OK']
    });

    await alert.present();
  }
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


  async takePicture(promptLabelHeader:string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Seleccione una opcion',
      promptLabelPhoto: 'Usar foto de la galeria',
      promptLabelPicture: 'Tomar una Foto',
    });    
  }

}

