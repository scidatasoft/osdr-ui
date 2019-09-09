import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[drTextAutoWidth]',
})
export class TextAutoWidthDirective implements OnInit, AfterViewInit {
  static groupedElements: { [id: string]: any[] } = {};

  // auto width of several inline elements in group
  @Input() groupName: string;
  // max inline element width
  @Input() maxWidth: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    TextAutoWidthDirective.groupedElements[this.groupName] = TextAutoWidthDirective.groupedElements[this.groupName] || [];
    const elements = TextAutoWidthDirective.groupedElements[this.groupName] as any;

    elements.push(this.el.nativeElement);
    elements.longestElementWidth = Math.max(elements.longestElementWidth || 0, this.el.nativeElement.offsetWidth);

    this.fitAllGroupWithSameWidth(elements, elements.longestElementWidth);
  }

  fitAllGroupWithSameWidth(elements, longestElementWidth: number) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      element.style.width = Math.min(longestElementWidth, +this.maxWidth) + 'px';
    }
  }
}
