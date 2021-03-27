import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  id: any = 1;
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  addActive(id: any) {
    // this.id = id;
    // console.log(this.id)
    // if (id == 1) {
    //   this.router.navigate(["/products"])
    // } else {
    //   this.router.navigate(["/report"])
    // }
  }

}
