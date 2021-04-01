import { Component, DoCheck, OnInit } from '@angular/core';

import { menuItem } from './menu-item';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, DoCheck {

  splitedUrl: Array<string>;
  menuItem: Array<object>

  constructor() {
    this.menuItem = menuItem;
  }

  ngDoCheck(): void {
    this.splitedUrl = window.location.href.split('/')
    // console.log("do check:", this.splitedUrl);

  }

  ngOnInit(): void {
    this.splitedUrl = window.location.href.split('/')
    // console.log("do init:", this.splitedUrl);
  }


}
