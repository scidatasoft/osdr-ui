import {Directive, Input, ElementRef, Renderer2, OnInit, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[drFocus]'
})
export class FocusDirective implements OnInit, AfterViewInit {

  private _autofocus;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this._autofocus || typeof this._autofocus === 'undefined') {
      this.renderer.selectRootElement(this.el.nativeElement);
      // this.renderer.addClass(this.el.nativeElement, 'focus');
    }
  }

  @Input() set drFocus(condition: boolean) {
    this._autofocus = condition !== false;
  }
}
