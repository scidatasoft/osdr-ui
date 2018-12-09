import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class PaginatorManagerService {

  // browser data & pagination
  defaultItemsPerPage = 20;
  paging = {
    itemsPerPage: this.defaultItemsPerPage,
    pagesCount: 0,
    itemsCount: 0,
    current: 1,
    pages: [],
    pagesRange: 7, // must be odd number
  };
  lastBrowserItemsCount = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) { }

  moveToPage(pageNumber: number, pageSize: number) {
    const pagesCount = Math.ceil(this.lastBrowserItemsCount / pageSize);
    this.paging.current = Math.min(pagesCount, pageNumber);
    this.paging.itemsPerPage = pageSize;
  }

  initPaginator(pageNumber: number, pageSize: number) {
    this.paging.current = pageNumber || 1;
    this.paging.itemsPerPage = pageSize
      || +localStorage.getItem('browserDefaultPageSize')
      || this.defaultItemsPerPage;

    // check if less than 0
    if (this.paging.current < 1 || this.paging.itemsPerPage < 1) {
      this.paging.current = Math.max(this.paging.current, 1);
      this.paging.itemsPerPage = Math.max(this.paging.itemsPerPage, this.defaultItemsPerPage);
    }

    const maxPageNumber = Math.ceil(this.paging.itemsCount / this.paging.itemsPerPage);
    if (maxPageNumber && maxPageNumber < this.paging.current) {
      this.paging.current = maxPageNumber;
    }

    localStorage.setItem('browserDefaultPageSize', this.paging.itemsPerPage.toString());
  }

  setPaginatorData(count) {
    this.paging.pagesCount = Math.ceil(count / this.paging.itemsPerPage);
    this.paging.itemsCount = this.lastBrowserItemsCount = count;
    const sub = this.paging.pagesCount - this.paging.current;
    const mid = Math.floor(this.paging.pagesRange / 2);
    this.paging.pages = new Array(Math.min(this.paging.pagesRange, this.paging.pagesCount))
      .fill(0)
      .map((e, i) =>
        i + Math.max(1, this.paging.current - mid - (sub < mid ? mid - sub : 0)));
  }
}
