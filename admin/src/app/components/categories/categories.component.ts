import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatDialog } from '@angular/material/dialog';
import { DialogCategoryComponent } from '../dialog-category/dialog-category.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';

import { NotificationsService } from '../../services/notifications.service';


import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  searchValue = "";

  categoryData = [];
  isLoading = true;

  displayedColumns: string[] = ['index', 'name', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private db: AngularFirestore,
    private dialog: MatDialog,
    public notiService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories()
  }


  getCategories() {
    this.db.collection("Categories").valueChanges().subscribe(data => {
      console.log(data)

      this.categoryData = data;

      this.db.collection("Categories").get().subscribe(items => {
        for (let i = 0; i < items.docs.length; i++) {
          this.categoryData[i] = {
            id: items.docs[i].id,
            ...this.categoryData[i]
          }
        }
        console.log("new data with id", this.categoryData)

        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.categoryData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })



    })
  }



  openAddDialog() {
    console.log("click open dialog")
    this.dialog.open(DialogCategoryComponent, {
      data: "add",
      autoFocus: false
    }).afterClosed().subscribe(res => {
      console.log("add res", res)
      if (res) {
        this.notiService.success("Thêm thành công");
        this.getCategories();
      }
    })

  }


  onDelete(chosenID: string) {
    console.log('delete', chosenID);
    this.dialog.open(ConfirmDialogComponent, { autoFocus: false }).afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.db.collection("Categories").doc(chosenID).delete();
          this.notiService.success("Xóa thành công");
          this.getCategories();
        }
      })
  }

  onEdit(chosenID: string) {
    console.log('edit', chosenID)
    this.dialog.open(DialogCategoryComponent, {
      data: chosenID,
      autoFocus: false
    }).afterClosed().subscribe(res => {
      console.log("edit res", res)
      if (res) {
        this.notiService.success("Sửa thành công");
        this.getCategories();
      }
    })
  }

  onSearchClear() {
    this.searchValue = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }

}

