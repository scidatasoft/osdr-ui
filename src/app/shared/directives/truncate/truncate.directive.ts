import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[drTruncate]',
})
export class TruncateDirective implements AfterViewInit {

  // max element size (px)
  @Input() maxWidth: number;
  @Input() lastSymbolsCount: number;
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {

    const update = () => {
      if (this.el.nativeElement.innerText) {
        this.el.nativeElement.removeEventListener('DOMSubtreeModified', update);
        while (this.updateElement(this.el.nativeElement, this.maxWidth, this.lastSymbolsCount)) { }
      }
    };

    this.el.nativeElement.addEventListener('DOMSubtreeModified', update, false);
  }

  updateElement(el: any, maxWidth: number, lastSymbolsCount: number) {
    if (el.offsetWidth <= maxWidth || !el.innerText) { return false; }

    if (el.lastInnerText !== el.innerText) {
      el.rawText = el.innerText;
    }

    const lastIndex = el.lastIndex || (el.innerText.length - lastSymbolsCount - 3); // 3 points (...)
    el.lastIndex = lastIndex - 1;

    el.lastInnerText = el.rawText.substring(0, lastIndex)
      + '...'
      + el.rawText.substring(el.rawText.length - lastSymbolsCount, el.rawText.length);
    el.innerText = el.lastInnerText;
    return true;
  }
}
