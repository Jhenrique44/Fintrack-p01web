import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { HttpClient } from '@angular/common/http';

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export interface CategoryRequest {
  name: string;
  type: 'income' | 'expense';
}
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  create(request: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
