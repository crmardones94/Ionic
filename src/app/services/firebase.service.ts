import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../Models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getFirestore, setDoc, getDoc, addDoc, collection, query, collectionData, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  auth = inject(AngularFireAuth);
  router = inject(Router);
  storage = inject(AngularFireStorage);

  //Acceder
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Crear
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Actualizar
  Updateuser(displayname:string){
    return updateProfile(getAuth().currentUser, {displayName: displayname});
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.router.navigateByUrl('auth');
  }


  //base de datos
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(), path));
  }

  updateDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  getFilePath(url: string){
    return ref(getStorage(), url);
  }

  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));
  }


  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'})
  }
  
}
