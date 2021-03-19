import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productImageLink: any = "";
  productName: any;
  productCode: any;
  productPrice: any;
  productAvailability: any;

  productImagePath: any;

  isEdit: boolean = false;

  chosenID: string;

  categories = [];

  selectedCategoryID: any;

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,
    private fireStorage: AngularFireStorage) { }

  ngOnInit(): void {

    // Init categories data for both add and edit
    this.getCategories().subscribe(data => {
      this.categories = data;

      this.db.collection("Categories").get().subscribe(list => {

        for (let i = 0; i < list.docs.length; i++) {
          this.categories[i] = {
            id: list.docs[i].id,
            ...this.categories[i]
          }
        }

        console.log("new categories with id", this.categories)

        if (this.data == "add") {
          this.selectedCategoryID = this.categories[0].id;
          console.log("initial category", this.selectedCategoryID)
        }
      })
    })


    if (this.data !== "add") {
      console.log("this is edit dialog");
      this.isEdit = true;

      this.chosenID = this.data;

      this.getChosenProduct().subscribe(data => {
        console.log("chosen document", data)
        let chosenDocument = data;

        this.productImageLink = chosenDocument["image"]
        this.productName = chosenDocument["name"]
        this.productCode = chosenDocument["code"]
        this.productPrice = chosenDocument["price"]
        this.productAvailability = chosenDocument["availability"]
        this.selectedCategoryID = chosenDocument["categoryID"]
      })
    }


  }

  getCategories() {
    return this.db.collection("Categories").valueChanges();
  }

  editProduct() {

    this.db.collection("Products").doc(this.chosenID).update({
      image: this.productImageLink,
      name: this.productName,
      code: this.productCode,
      price: this.productPrice,
      availability: this.productAvailability,
      categoryID: this.selectedCategoryID
    })
      .then(res => {
        console.log("edit successfully", res)
      })
      .catch(err => console.log(err))
  }

  getChosenProduct() {
    return this.db.collection("Products").doc(this.chosenID).valueChanges();
  }

  addProduct() {
    console.log("click add product")


    let productData = {
      name: this.productName,
      image: this.productImageLink,
      code: this.productCode,
      price: this.productPrice,
      availability: this.productAvailability,
      categoryID: this.selectedCategoryID
    }

    console.log("data", productData);

    let tempId = this.db.createId();

    this.insertProductData(tempId, productData).then(() => {
      console.log("Thêm sản phẩm thành công")
      this.productName = "";
      this.productImageLink = "";
      this.productCode = "";
      this.productPrice = "";
      this.productAvailability = "";
    })
      .catch(err => console.log(err))

  }

  insertProductData(tempID: string, data: object) {
    return this.db.doc(`Products/${tempID}`).set(data)
  }


  changeProductImage($event) {
    this.productImagePath = $event.target.files[0];

    console.log("image path:", this.productImagePath)

    let tempID = this.db.createId();


    this.fireStorage.upload("/productImage/" + `product-${tempID}`, this.productImagePath)
      .then(() => {
        this.fireStorage.storage.ref('/productImage/' + `product-${tempID}`).getDownloadURL()
          .then(link => {
            this.productImageLink = link;
            console.log("link: " + this.productImageLink)
          })
      })
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
