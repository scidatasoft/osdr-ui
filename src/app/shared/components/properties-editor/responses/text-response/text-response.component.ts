import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'dr-text-response',
  templateUrl: './text-response.component.html',
  styleUrls: ['./text-response.component.scss']
})
export class TextResponseComponent implements AfterViewInit {
  @Input() screenPartMetaData: any;
  @Input() screenCollectionData: any;
  @Input() autofocus = false;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    if (this.autofocus) {
      const elementName = this.screenPartMetaData.dataType === 'text' ? 'textarea' : 'input';
      setTimeout(() => {
        const input = this.elementRef.nativeElement.getElementsByTagName(elementName)[0];
        if (input) {
          input.focus();
        }
      });
    }
  }
}
