import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../Book/book.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service'; // Adjust the path as per your project structure

@Component({
  selector: 'app-modify-book-dialog',
  templateUrl: './modify-book-dialog.component.html',
  styleUrls: ['./modify-book-dialog.component.css']
})
export class ModifyBookDialogComponent implements OnInit {
  book: Book; 
  bookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModifyBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService // Adjust dependency injection as per your project structure
  ) {
    this.book = { ...data }; 
    this.bookForm = this.fb.group({
      id: [this.book.id, Validators.required],
      bookName: [this.book.bookName, Validators.required],
      bookAuthor: [this.book.bookAuthor, Validators.required],
      bookGenre: [this.book.bookGenre, Validators.required],
      noOfCopies: [this.book.noOfCopies, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    
  }

  save(): void {
    this.book = { ...this.book, ...this.bookForm.value };
    this.authService.updateBook(this.book).subscribe(
      () => {
        this.toastr.success('Book updated successfully.');
        this.dialogRef.close(this.book);
      },
      (error: any) => {
        this.toastr.error('Failed to update book.');
        console.error('Error updating book:', error);
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close(); 
  }
}
