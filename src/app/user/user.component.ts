import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit {
  editdata: any;
  registerform: FormGroup;
  userlist: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['username', 'name', 'status', 'status','role', 'action'];

  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.registerform = this.builder.group({
      role: ['', Validators.required],
      isactive: [false]
    });

    this.LoadUser();
  }

  ngAfterViewInit(): void {
  }

  LoadUser() {
    this.service.Getall().subscribe(res => {
      this.userlist = res;
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  updateuser(code: any) {
    this.OpenDialog('1000ms', '600ms', code);
  }


  OpenDialog(enteranimation: any, exitanimation: any, code: string) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '30%',
      data: { usercode: code }
    });

    popup.afterClosed().subscribe(res => {
      this.LoadUser();
    });
  }
}
