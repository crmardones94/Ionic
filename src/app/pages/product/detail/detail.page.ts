import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, map } from 'rxjs';
import { ProductService } from '../product.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Product } from 'src/app/Models/product.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  firebasesvc = inject(FirebaseService);
  firestore = inject(AngularFirestore);
  route = inject(ActivatedRoute);

  products: Product[] = [];

  constructor() { }

  getProdcuts(){
    //let path = `users/${this.user().uid}/products`
    this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        let path = `products/${productId}`
        return this.firebasesvc.getCollectionData(path);
      })
    ).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
      }
    });
  }

  ngOnInit() {
    this.getProdcuts();
    
  }

}
