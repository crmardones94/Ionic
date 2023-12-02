import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { User } from '../Models/user.model';
import { Product } from '../Models/product.model';
import { AlertOptions } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  firebasesvc = inject(FirebaseService);
  router = inject(Router);



  products: Product[] = [];

  user(): User{
    return this.getLocalStorage('user');
  }

  ionViewWillEnter(){
    this.getProdcuts();
  }

  getProdcuts(){
    //let path = `users/${this.user().uid}/products`
    let path = `products`
    let sub = this.firebasesvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    });
  }

  signOut(){
    this.firebasesvc.signOut();
  }

  routerLink(){
    this.router.navigateByUrl('/product');
  }

  goToProfile(){
    this.router.navigateByUrl('/profile');
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  goToDetail(product: Product){
    this.router.navigateByUrl(`product/detail/${product.id}}`);
  }

  async deleteProdcut(product: Product){
    let path = `products/${product.id}`;
    let imagePath = await this.firebasesvc.getFilePath(product.image);
    await this.firebasesvc.deleteFile(imagePath.toString());
    let res = await this.firebasesvc.deleteDocument(path).then(res => {
      this.getProdcuts();
    }).catch(error => {});
    console.log(res);
  }



}
