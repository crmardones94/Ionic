import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  firestore = inject(Firestore);

  constructor() { }

  getDocument (path:string, id:string){
    const docRef = doc(this.firestore,path,id);
    return getDoc(docRef);
  }
}
