import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogShowComponent } from '../dialog-show/dialog-show.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';

import { NotificationsService } from '../../services/notifications.service';


import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  searchValue = "";

  isLoading = true;

  orders = [];
  ordersToUpdate = [];

  productData = []

  displayedColumns: string[] =
    ['index', 'orderID', 'products', 'totalMoney', 'totalProducts', 'createdAt', 'doneAt', 'method',
      'storeToPick', 'paymentMethod', 'recipient', 'isDone', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private db: AngularFirestore,
    private dialog: MatDialog,
    public notiService: NotificationsService,
    private router: Router) { }

  ngOnInit(): void {

    // this.updateOrders()
    this.getOrders()
  }

  getProducts() {

    this.db.collection("Products").valueChanges().subscribe(data => {
      this.productData = data;
    })

    this.db.collection("Products").get().subscribe(items => {
      // console.log(items);

      // Append id for products
      for (let i = 0; i < items.docs.length; i++) {
        this.productData[i] = {
          id: items.docs[i].id,
          ...this.productData[i]
        }
      }
      console.log("new products data with id", this.productData)

      for (let i = 0; i < this.orders.length; i++) {
        let order = this.orders[i];
        for (let j = 0; j < order.products.length; j++) {
          let product = order.products[j];


          // product = data[0];

          // product.name = tempProduct["name"]
          // product.availability = tempProduct["availability"]
          // product.categoryID = tempProduct["categoryID"]
          // product.image = tempProduct["image"]
          // product.price = tempProduct["price"]
          // product.selectedStores = tempProduct["selectedStores"]


          console.log("new product", product)
        }
      }
    })



  }

  updateOrders() {
    this.db.collection("Products").valueChanges()

    for (let i = 0; i < this.orders.length; i++) {
      let order = this.orders[i];
      for (let j = 0; j < order.products.length; j++) {
        let product = order.products[j];

        this.db.collection("Products", ref => ref.where("code", "==", product.code)).valueChanges().subscribe(data => {
          console.log("data", data)
          let tempProduct = data[0];

          product = data[0];

          product.name = tempProduct["name"]
          product.availability = tempProduct["availability"]
          product.categoryID = tempProduct["categoryID"]
          product.image = tempProduct["image"]
          product.price = tempProduct["price"]
          product.selectedStores = tempProduct["selectedStores"]


        })
        console.log("new product", product)
      }
    }
    console.log("new orders", this.orders)


  }

  getOrders() {

    this.db.collection("Orders").valueChanges().subscribe(orders => {
      console.log(orders)

      this.orders = orders;

      // Thông báo cụ thể hơn
      this.orders.map(order => {
        if (order.method == 'shipping' && order.isDone) {
          order.status = "Đã giao hàng"
        } else if (order.method !== 'shipping' && order.isDone) {
          order.status = "Đã thanh toán"
        } else if (order.method == 'shipping' && !order.isDone) {
          order.status = "Đang giao hàng"
        } else {
          order.status = "Chưa thanh toán"
        }
      })

      // xóa doneAt khi đơn bị báo chưa hoàn thành
      this.orders.map(order => {
        if (!order.isDone) {
          delete order.doneAt
        }
      })

      // cụ thể hình thức thanh toán 
      this.orders.map(order => {
        if (order.paymentMethod) {
          if (order.paymentMethod == 'cod') {
            order.paymentMethod = 'Thanh toán khi nhận hàng'
          } else {
            order.paymentMethod = 'Chuyển khoản'
          }
        }
      })

      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.orders)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log("orders with status", this.orders)

      // this.updateOrders()
    })
  }

  getFilterStatus(filterValue) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }

  doneOrder(orderID, event) {
    console.log("order ID:", orderID)
    // console.log(event);

    this.dialog.open(ConfirmDialogComponent, {
      data: "isDone",
      autoFocus: false
    }).afterClosed().subscribe(res => {
      if (res) {
        // is done
        console.log("done Order: ", res)

        let currentDoc;
        this.db.collection("Orders", ref => ref.where("id", "==", orderID)).get().subscribe(data => {
          // console.log(data)
          currentDoc = data.docs[0].id;

          // Add doneAt
          let today = new Date();
          let currentMonth = today.getMonth() + 1;
          let currentYear = today.getFullYear();
          let currentDay = today.getDate();
          let currentHour = today.getHours()
          let currentMinutes = today.getMinutes();
          let fixMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;
          let isAM = currentHour >= 12 ? "PM" : "AM";
          let doneAt = `${currentHour}:${fixMinutes} ${isAM} ${currentDay}/${currentMonth}/${currentYear}`;

          // this.db.collection("Orders").doc(currentDoc).update({ isDone: true, doneAt: doneAt })

          this.db.collection("Orders", ref => ref.where("id", "==", orderID)).valueChanges().subscribe(orderData => {
            // let thisOrderData = order[0]
            console.log("order done data", orderData)
          })
        })
      }
    })
  }

  openProducts(orderID) {
    console.log(orderID)
    this.dialog.open(DialogShowComponent, {
      data: {
        data: orderID,
        name: "products"
      },
      autoFocus: false
    })
  }

  openRecipient(orderID, userID) {
    console.log("order ID:", orderID)
    if (userID) {
      this.dialog.open(DialogShowComponent, {
        data: {
          data: orderID,
          name: "recipient"
        },
        autoFocus: false
      })
    }
  }

  onSearchClear() {
    this.searchValue = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }

}
