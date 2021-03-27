import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


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

  stores = [];
  selectedStores = [];

  // ng-multiselect-dropdown
  dropdownList = [];
  dropdownSettings: IDropdownSettings;

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,
    private fireStorage: AngularFireStorage) { }

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'ten',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Tìm theo tên cửa hàng'
    };

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

        console.log("data categories with id", this.categories)

        this.getStores().subscribe(storeData => {
          this.stores = storeData;

          this.db.collection("Stores").get().subscribe(storeIDs => {
            for (let j = 0; j < storeIDs.docs.length; j++) {
              this.stores[j] = {
                id: storeIDs.docs[j].id,
                ...this.stores[j]
              }
            }

            console.log("data stores with id", this.stores)
            // for ng dropdown data
            this.dropdownList = this.stores;

            if (this.data == "add") {
              this.selectedCategoryID = this.categories[0].id;
              console.log("initial category", this.selectedCategoryID)



            } else {
              console.log("this is edit dialog");
              this.isEdit = true;

              this.chosenID = this.data;

              this.getChosenProduct(this.chosenID).subscribe(data => {
                console.log("chosen document", data)
                let chosenDocument = data;

                this.productImageLink = chosenDocument["image"]
                this.productName = chosenDocument["name"]
                this.productCode = chosenDocument["code"]
                this.productPrice = chosenDocument["price"]
                this.productAvailability = chosenDocument["availability"]
                this.selectedCategoryID = chosenDocument["categoryID"]
                this.selectedStores = chosenDocument["selectedStores"]
              })
            }




          })
        })


      })
    })

  }

  getCategories() {
    return this.db.collection("Categories").valueChanges();
  }

  getStores() {
    return this.db.collection("Stores").valueChanges();
  }

  editProduct() {

    this.db.collection("Products").doc(this.chosenID).update({
      image: this.productImageLink,
      name: this.productName,
      code: this.productCode,
      price: this.productPrice,
      availability: this.productAvailability,
      categoryID: this.selectedCategoryID,
      selectedStores: this.selectedStores
    })
      .then(res => {
        console.log("edit successfully", res)
      })
      .catch(err => console.log(err))
  }

  getChosenProduct(chosenID) {
    return this.db.collection("Products").doc(chosenID).valueChanges();
  }

  addProduct() {
    console.log("click add product")

    let productData = {
      name: this.productName,
      image: this.productImageLink,
      code: this.productCode,
      price: this.productPrice,
      availability: this.productAvailability,
      categoryID: this.selectedCategoryID,
      selectedStores: this.selectedStores
    }

    console.log("product data to add", productData);

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

  // ng dropdown funcs
  onItemSelect(item: any) {
    console.log("dropdown chosen item", item);
    // console.log("current selected stores", this.selectedStores)

  }
  onSelectAll(items: any) {
    console.log("all dropdown chosen items", items);
    // console.log("current selected stores", this.selectedStores)
  }

  onDeSelectAll() {
    this.selectedStores = [];
    console.log("current selected stores", this.selectedStores)
  }
  onItemDeSelect(item: any) {
    console.log("this one is unselected", item)
    this.selectedStores.map((store, index) => {
      if (store.id == item.id) {
        this.selectedStores.splice(index, 2)
      }
    })
    console.log("current selected stores", this.selectedStores)
  }


}
