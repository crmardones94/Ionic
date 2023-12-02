import { Component, OnInit, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { User } from 'src/app/Models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebasesvc = inject(FirebaseService);

  user(): User{
    return this.getLocalStorage('user');
  }

  async TakeImage(){

    let user = this.user();
    let path = `users/${user.uid}`;

    const dataURL = (await this.takePicture('Tomar una foto')).dataUrl;

    let imagePath = `${user.uid}/${Date.now()}`
    user.image = await this.firebasesvc.uploadImage(imagePath, dataURL);

    this.firebasesvc.updateDocument(path, {image: user.image});

    this.saveLocalStorage('user', user);

  }

  ngOnInit() {
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  saveLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
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

  signOut(){
    this.firebasesvc.signOut();
  }
}
