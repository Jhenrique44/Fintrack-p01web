import { Injectable } from '@angular/core';
import { environment } from '../../../env/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';


export interface Transaction { 
  id: number; 
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryName: string;
}  
export interface TransactionRequest { 
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
}

export interface Balance { 
  totalIncome: number; 
  totalExpense: number;
  balance: number;
}
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  create(request: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, request);
  }

  delete(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`);
  }
  getBalance(start: string, end: string): Observable<Balance> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Balance>(`${this.apiUrl}/transactions/balance`, { params });

  }

}
