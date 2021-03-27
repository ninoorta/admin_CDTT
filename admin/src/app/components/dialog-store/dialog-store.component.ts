import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-store',
  templateUrl: './dialog-store.component.html',
  styleUrls: ['./dialog-store.component.scss']
})
export class DialogStoreComponent implements OnInit {

  ten: string;
  thanhPho: string;
  huyen: string;
  xa: string;
  chiTiet: string;
  isEdit: boolean = false;

  chosenID: any;

  constructor(private dialogRef: MatDialogRef<DialogStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,) { }

  ngOnInit(): void {

    console.log("received data", this.data);

    if (this.data !== "add") {
      this.isEdit = true;

      this.chosenID = this.data;

      this.getCurrentDocument().subscribe(data => {
        let chosenDocument = data;
        console.log("chosen document to edit", chosenDocument)
        this.ten = chosenDocument["ten"];
        this.thanhPho = chosenDocument["thanhPho"];
        this.huyen = chosenDocument["huyen"];
        this.xa = chosenDocument["xa"];
        this.chiTiet = chosenDocument["chiTiet"];
      })

    }
  }

  addStore() {
    console.log("click add category");

    let data = {
      ten: this.ten,
      thanhPho: this.thanhPho,
      huyen: this.huyen,
      xa: this.xa,
      chiTiet: this.chiTiet
    }

    let tempID = this.db.createId();

    this.db.doc(`Stores/${tempID}`).set(data).then(res => {
      console.log("Thêm cửa hàng thành công", res);

      this.ten = "";
      this.thanhPho = "";
      this.huyen = "";
      this.xa = "";
      this.chiTiet = "";
    })
      .catch(err => console.log(err))
  }

  editStore() {
    this.db.collection("Stores").doc(this.chosenID).update({
      ten: this.ten,
      thanhPho: this.thanhPho,
      huyen: this.huyen,
      xa: this.xa,
      chiTiet: this.chiTiet
    })
      .then(res => {
        console.log("edit successfully", res)
      })
      .catch(err => console.log(err))
  }

  getCurrentDocument() {
    return this.db.collection("Stores").doc(this.chosenID).valueChanges();
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
