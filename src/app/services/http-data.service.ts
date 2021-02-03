// http-data.servie.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Employee } from '../models/employee';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Result, Results } from '../site-form/survey/survey.component';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {


  // API path
  base_path = 'http://localhost:3000/employees'; // decoy
  base_questionnaires = 'http://localhost:3000/questionnaires';
  base_result = 'http://localhost:3000/results';
  base_categories = 'http://localhost:3000/categories';

//  base_path = 'http://wylde:3000/employees';
//  base_result = 'http://wylde:3000/result';
  res: Result[] = new Array()

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  // Create a new item
  createItem(item): Observable<string> {
    return this.http
      .post<string>(this.base_path, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  /*
  saveResult(item): Observable<any> {
    return this.http
      .post<any>(this.base_questionnaires, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  */
 saveResult(item): Observable<any> {
  return this.http
    .post<any>(this.base_result, JSON.stringify(item), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
}
updateResult(id, item): Observable<Employee> {
  return this.http
    .put<any>(this.base_result + '/' + id, JSON.stringify(item), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
}

/*
  getResult(id): Observable<Results> {
    return this.http
      .get<Results>(this.base_result + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  */
 getResult(id): Observable<any> {
  return this.http
    .get<any>(this.base_result + '/' + id)
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
}
  // Get single Employee data by ID
  getItem(id): Observable<string> {
    return this.http
      .get<string>(this.base_path + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getCategoryItem(id): Observable<string> {
    return this.http
      .get<string>(this.base_questionnaires + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getCategory(id): Observable<any> {
    return this.http
      .get<any>(this.base_categories + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  // Get Employees data
  getList(): Observable<any> {
    return this.http
      .get<any>(this.base_path)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getResults(): Observable<any> {
    return this.http
      .get<any>(this.base_result)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getCategories(): Observable<any> {
    return this.http
      .get<any>(this.base_categories)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  updateCategory(id, item): Observable<Employee> {
    return this.http
      .put<any>(this.base_categories + '/' + id, item, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  createCategory(item): Observable<any> {
    return this.http
      .post<any>(this.base_categories, item, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  

  // Update item by id
  updateItem(id, item): Observable<Employee> {
    return this.http
      .put<Employee>(this.base_path + '/' + id, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Delete item by id
  deleteItem(id) {
    return this.http
      .delete<Employee>(this.base_path + '/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  deleteCategory(id) {
    return this.http
      .delete<any>(this.base_categories + '/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  deleteResult(id) {
    return this.http
      .delete<any>(this.base_categories + '/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  
}