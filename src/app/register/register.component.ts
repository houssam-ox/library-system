import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['User']  ,
      isactive: [false] 
    });
  }

  ngOnInit(): void {
  }

  proceedRegister() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe(
        () => {
          this.toastr.success('Registered successfully');
          this.router.navigate(['login']);
        },
        (error) => {
          console.error('Error registering user:', error);
          this.toastr.error('Failed to register user. Please try again.');
        }
      );
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }

}
