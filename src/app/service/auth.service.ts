import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../Book/book.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // addBook(result: any) {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private http:HttpClient) { 

  }
  apiurl='http://localhost:3000/user';
registerUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiurl, userData);
  }
  GetUserbyCode(id:any){
    return this.http.get(this.apiurl+'/'+id);
  }
  Getall(){
    return this.http.get(this.apiurl);
  }
  updateuser(id:any,inputdata:any){
    return this.http.put(this.apiurl+'/'+id,inputdata);
  }
  getuserrole(){
    return this.http.get('http://localhost:3000/role');
  }
  isloggedin(){
    return sessionStorage.getItem('username')!=null;
  }
  getrole(){
    return sessionStorage.getItem('role')!=null?sessionStorage.getItem('role')?.toString():'';
  }
  GetAllbook(){
    return this.http.get('http://localhost:3000/books');
  }
  Getaccessbyrole(role:any,menu:any){
    return this.http.get('http://localhost:3000/roleaccess?role='+role+'&menu='+menu)
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/books`, bookData);
  }

  updateBook(bookData: Book): Observable<any> {
    const { id, ...updatedBook } = bookData;
    return this.http.put<any>(`http://localhost:3000/books/${id}`, updatedBook);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/books/${id}`);
  }
}
