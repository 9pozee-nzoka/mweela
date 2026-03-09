import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BoardingService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // Get headers with optional auth token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Centralized error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error - extract message from various formats
      console.error('Backend error:', error);
      
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials.';
      } else if (error.status === 404) {
        errorMessage = 'User not found.';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  login(data: { email: string; password: string }): Observable<any> {
    console.log('Login request:', data);
    
    return this.http.post(`${this.apiUrl}/login`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(res => console.log('Login response:', res)),
      catchError(this.handleError.bind(this))
    );
  }

  register(data: any): Observable<any> {
    // Clean data - remove confirmPassword if present
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password
    };

    console.log('Register request:', payload);

    return this.http.post(`${this.apiUrl}/register`, payload, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(res => console.log('Register response:', res)),
      catchError(this.handleError.bind(this))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  resetPassword(token: string, data: any): Observable<any> {
    // Clean data - only send password
    const payload = { password: data.password };

    return this.http.post(`${this.apiUrl}/reset-password/${token}`, payload, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${userId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}