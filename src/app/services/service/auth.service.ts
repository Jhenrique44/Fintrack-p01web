import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../env/environment';
import { Observable, tap } from 'rxjs';

export interface LoginRequest { 
  email: string;
  password: string;
}

export interface LoginResponse { 
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface RegisterRequest{ 
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {} 

  login(request: LoginRequest): Observable<LoginResponse>{ 
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('userName', response.name);
      })
    )
  }
  register(request: RegisterRequest): Observable<any>{ 
    return this.http.post(`${this.apiUrl}/users`, request);
  }

  logout(): void { 
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  getToken(): string | null { 
    return localStorage.getItem('token');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
