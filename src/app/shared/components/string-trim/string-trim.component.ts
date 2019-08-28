import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {BrowserDataItem} from 'app/shared/components/organize-browser/browser-types';

@Component({
  selector: 'dr-string-trim',
  templateUrl: './string-trim.component.html',
  styleUrls: ['./string-trim.component.scss']
})
export class StringTrimComponent implements OnInit {

  @ViewChild('rulerLength', { static: true }) public rulerLength: ElementRef;
  @Input() blockLength = 0;
  @Input() trimmedText: string|BrowserDataItem;
  shortenedText = '';
  textWasShorted = false;
  isBrowserItem = false;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(
      () => {
        if (this.trimmedText && this.trimmedText instanceof BrowserDataItem && this.trimmedText.name.length > 0 && this.blockLength > 0) {
          this.isBrowserItem = true;
          this.trimItemName();
        } else if (this.trimmedText && this.trimmedText instanceof String && this.trimmedText.length > 0 && this.blockLength > 0) {
          this.trimString();
        }
      }
    );
  }

  trimString() {
    if (this.trimmedText instanceof String) {
      const originalText = this.trimmedText;
      let trimmed = '';
      let tmp = this.trimmedText;
      let i = 0;

      this.shortenedText = '';
      trimmed = trimmed + tmp;
      this.rulerLength.nativeElement.innerHTML = originalText;

      if (this.rulerLength.nativeElement.offsetWidth > this.blockLength) {
        this.textWasShorted = true;
        this.rulerLength.nativeElement.innerHTML = trimmed;
        while (this.rulerLength.nativeElement.offsetWidth > this.blockLength) {
          tmp = tmp.substring(0, tmp.length - 1);
          trimmed = tmp + '...';
          this.rulerLength.nativeElement.innerHTML = trimmed;
          i++;
        }
      }

      this.rulerLength.nativeElement.innerHTML = '';
      this.shortenedText = trimmed;
    }
  }

  trimItemName() {
    if (this.trimmedText instanceof BrowserDataItem) {
      const originalText = this.trimmedText.name;
      let trimmed = '';
      let tmp = this.trimmedText.getFileNameWithoutExtension();
      let ext = this.trimmedText.getFileExtension();
      if (ext.length > 0 && ext !== tmp) {
         ext = '.' + ext;
      } else {
        ext = '';
      }
      let i = 0;

      this.shortenedText = '';
      trimmed = trimmed + tmp + ext;
      this.rulerLength.nativeElement.innerHTML = originalText;

      if (this.rulerLength.nativeElement.offsetWidth > this.blockLength) {
        this.textWasShorted = true;
        this.rulerLength.nativeElement.innerHTML = trimmed;
        while (this.rulerLength.nativeElement.offsetWidth > this.blockLength) {
          tmp = tmp.substring(0, tmp.length - 1);
          trimmed = tmp + ' ... ' + ext;
          this.rulerLength.nativeElement.innerHTML = trimmed;
          i++;
          if (i > 300) {
            break;
          }
        }
      }

      this.rulerLength.nativeElement.innerHTML = '';
      this.shortenedText = trimmed;
    }
  }
}
