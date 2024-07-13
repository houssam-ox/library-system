import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from './book.model';
import { ModifyBookDialogComponent } from '../modify-book-dialog/modify-book-dialog.component';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements AfterViewInit {
  booklist: any;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  accessdata: any;
  haveedit = false;
  haveadd = false;
  havedelete = false;

  constructor(
    private service: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SetAccessPermission();
  }

  ngAfterViewInit(): void {
    this.LoadBook();
  }

  LoadBook(): void {
    this.service.GetAllbook().subscribe(res => {
      this.booklist = res;
      this.dataSource = new MatTableDataSource(this.booklist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  SetAccessPermission(): void {
    this.service.Getaccessbyrole(this.service.getrole(), 'book').subscribe(res => {
      this.accessdata = res;

      if (this.accessdata.length > 0) {
        this.haveadd = this.accessdata[0].haveadd;
        this.haveedit = this.accessdata[0].haveedit;
        this.havedelete = this.accessdata[0].havedelete;
        this.LoadBook();
      } else {
        alert('You are not authorized to access.');
        this.router.navigate(['']);
      }
    });
  }

  displayedColumns: string[] = ['id', 'bookName', 'bookAuthor', 'bookGenre', 'noOfCopies', 'action'];

  updateBook(book: Book): void {
    const dialogRef = this.dialog.open(ModifyBookDialogComponent, {
      width: '300px',
      data: book // Pass current book data to dialog
    });

  }
  
  deleteBook(id: string) {
    if (this.havedelete) {
      this.service.deleteBook(id).subscribe(() => {
        this.toastr.success('Book deleted successfully');
        this.LoadBook(); 
      });
    } else {
      this.toastr.warning("You don't have access for Delete");
    }
  }

  addBook(): void {
    if (this.haveadd) {
      const dialogRef = this.dialog.open(AddBookDialog, {
        width: '300px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.addBook(result).subscribe(
            () => {
              this.toastr.success('Book added successfully');
              this.LoadBook();
            },
            (error: any): void => {
              this.toastr.error('Failed to add book');
            }
          );
        }
      });
    } else {
      this.toastr.warning("You don't have access for Create");
    }
  }
}

@Component({
  selector: 'add-book-dialog',
  template: `
    <h1 mat-dialog-title>Add Book</h1>
    <div mat-dialog-content>
      <form [formGroup]="bookForm">
        <mat-form-field>
          <mat-label>ID</mat-label>
          <input matInput formControlName="id">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Book Name</mat-label>
          <input matInput formControlName="bookName">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Author</mat-label>
          <input matInput formControlName="bookAuthor">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Genre</mat-label>
          <input matInput formControlName="bookGenre">
        </mat-form-field>
        <mat-form-field>
          <mat-label>No of Copies</mat-label>
          <input matInput formControlName="noOfCopies" type="number">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="bookForm.value" [disabled]="!bookForm.valid">Add</button>
    </div>
  `
})
export class AddBookDialog {
  bookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddBookDialog>,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      id: ['', Validators.required],
      bookName: ['', Validators.required],
      bookAuthor: ['', Validators.required],
      bookGenre: ['', Validators.required],
      noOfCopies: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
