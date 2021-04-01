import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-show',
  templateUrl: './dialog-show.component.html',
  styleUrls: ['./dialog-show.component.scss']
})
export class DialogShowComponent implements OnInit {

  recipientID: any;
  orderID: any;

  recipientName: any;
  recipientNote: any;
  recipientPhone: any;
  recipientAddress: any;

  isRecipient: boolean;

  products: Array<Object>;

  constructor(private dialogRef: MatDialogRef<DialogShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore
  ) { }

  ngOnInit(): void {

    console.log(this.data);
    this.orderID = this.data.data;

    if (this.data.name == "recipient") {
      this.isRecipient = true;
      this.getRecipientInfo(this.orderID)

    } else {
      this.isRecipient = false;
      this.getProductsInfo(this.orderID)
    }
  }

  getRecipientInfo(id) {
    this.db.collection("Orders", ref => ref.where("id", "==", id)).valueChanges().subscribe(data => {
      console.log(data)
      let recipient = data[0]['recipient']

      this.recipientName = recipient.name;
      this.recipientAddress = recipient.address;
      this.recipientPhone = recipient.phone;
      this.recipientNote = recipient.note ? `${recipient.note}` : `Không có`;
    })


  }

  getProductsInfo(id) {
    this.db.collection("Orders", ref => ref.where("id", "==", id)).valueChanges().subscribe(data => {
      this.products = data[0]['products'];
      console.log("products in this order", this.products)

    })

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
