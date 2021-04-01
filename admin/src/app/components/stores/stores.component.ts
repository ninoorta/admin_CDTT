import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatDialog } from '@angular/material/dialog';
import { DialogStoreComponent } from '../dialog-store/dialog-store.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';

import { NotificationsService } from '../../services/notifications.service';


import { Router } from '@angular/router';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  searchValue = "";

  isLoading = true;

  stores = [];

  displayedColumns: string[] = ['index', 'ten', 'thanhPho', 'huyen', 'xa', 'chiTiet', 'actions'];
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

    this.getStores();
  }

  openAddDialog() {
    this.dialog.open(DialogStoreComponent, {
      data: "add",
      autoFocus: false
    }).afterClosed().subscribe(res => {
      if (res) {
        this.notiService.success("Thêm cửa hàng thành công");
        this.getStores();
      }
    })
  }

  onEdit(chosenID: string) {
    this.dialog.open(DialogStoreComponent, {
      data: chosenID,
      autoFocus: false
    }).afterClosed().subscribe(res => {
      if (res) {
        this.notiService.success("Cập nhật cửa hàng thành công");
        this.getStores();
      }
    })
  }

  onDelete(chosenID: string) {
    console.log('delete', chosenID);
    this.dialog.open(ConfirmDialogComponent, { autoFocus: false }).afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.db.collection("Stores").doc(chosenID).delete();
          this.notiService.success("Xóa thành công");
          this.getStores();
        }
      })
  }

  getStores() {
    this.db.collection("Stores").valueChanges().subscribe(stores => {
      console.log("Stores data", stores)
      this.stores = stores;
    })

    this.db.collection("Stores").get().subscribe(list => {
      // console.log("list", list)

      let docIDs = list.docs

      for (let i = 0; i < docIDs.length; i++) {
        this.stores[i] = {
          id: docIDs[i].id,
          ... this.stores[i]
        }
      }

      console.log("new stores data with id", this.stores)

      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.stores)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
