import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.scss']
})
export class DialogCategoryComponent implements OnInit {


  name: string;
  chosenID: string;

  isEdit: boolean = false;

  constructor(private dialogRef: MatDialogRef<DialogCategoryComponent>,
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
        this.name = chosenDocument["name"]
      })

    }
  }


  addCategory() {
    console.log("click add category");

    let data = {
      name: this.name,
    }

    let tempID = this.db.createId();

    this.db.doc(`Categories/${tempID}`).set(data).then(res => {
      console.log("Thêm sản phẩm thành công", res);

      this.name = "";
    })
      .catch(err => console.log(err))
  }

  getCurrentDocument() {
    return this.db.collection("Categories").doc(this.chosenID).valueChanges();
  }
  editCategory() {
    this.db.collection("Categories").doc(this.chosenID).update({
      name: this.name
    })
      .then(res => {
        console.log("edit successfully", res)
      })
      .catch(err => console.log(err))
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
