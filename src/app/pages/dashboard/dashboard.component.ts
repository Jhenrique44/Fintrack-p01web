import { Component, OnInit } from '@angular/core';
import { Balance, Transaction, TransactionService } from '../../services/service/transaction.service';
import { AuthService } from '../../services/service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  balance: Balance = { totalIncome: 0, totalExpense: 0, balance: 0 };
  recentTransactions: Transaction[] = [];
  userName: string = '';
  loading: boolean = true;
  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || 'User';
    this.loadData();
  }

  loadData(): void { 
    const now = new Date();
    const start =  new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().split('T')[0];

    this.transactionService.getBalance(start, end).subscribe({ 
      next: (data) => { 
        this.balance = data;
      }
    });

    this.transactionService.findAll().subscribe({
      next: (data) => {
        this.recentTransactions = data.slice(0, 5);
        this.loading = false;
      }
    });
  }

  logout(): void { 
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string): void { 
    this.router.navigate([path]);
  }

}
