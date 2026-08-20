import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction, TransactionService } from '../../services/service/transaction.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Category, CategoryService } from '../../services/service/category.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  transactionForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', [Validators.required]],
      type: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.loadData();

    this.transactionForm.get('type')?.valueChanges.subscribe((type) => {
      this.filteredCategories = this.categories.filter((c) => c.type === type);
      this.transactionForm.get('categoryId')?.reset();
    });
  }

  loadData(): void {
    this.transactionService.findAll().subscribe({
      next: (data) => (this.transactions = data),
    });

    this.categoryService.findAll().subscribe({
      next: (data) => (this.categories = data),
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    this.loading = true;

    const formValue = this.transactionForm.value;
    const request =  {
      ...formValue,
      date: new Date(formValue.date).toISOString().split('T')[0],
    };

    this.transactionService.create(request).subscribe( {
      next: () => { 
        this.snackBar.open('Transaction created successfully', 'Close', { duration: 3000 });
        this.transactionForm.reset();
        this.loading = false;
        this.loadData();
      },
      error: (err) =>{ 
        this.loading = false;
        this.snackBar.open(
          err.error?.message || 'Transaction failed', 'Close', { duration: 3000 }
        );
      }
    });
  }
  delete(id: number): void{ 
    this.transactionService.delete(id).subscribe({
      next: () => { 
        this.snackBar.open('Transaction removed successfully', 'Close', { duration: 3000 });
        this.loadData();
      }
    });
  }
  goBack(): void{ 
    this.router.navigate(['/dashboard']);
  }
}
