// temporary feature. will be removed
import {
  Directive, ElementRef, Input, OnInit,  Renderer2, EventEmitter, Output, AfterContentInit
} from '@angular/core';
import { of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'img'
})
export class InlineSvgDirective implements OnInit, AfterContentInit {
  static cache = {};
  @Input() src: string;
  styleAttr: string;
  @Output() loadPreview = new EventEmitter<any>();

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient) {

  }

  ngOnInit(): void {

  }

  ngAfterContentInit() {
    if ((!this.src || !this.src.endsWith('.svg') || this.el.nativeElement.hasAttribute('no-inline'))
      && !this.el.nativeElement.hasAttribute('inline')) {
      this.el.nativeElement.setAttribute('src', this.src);
      return;
    }

    const classAttr = this.el.nativeElement.attributes[0].name;
    this.styleAttr = (<any>this.renderer).delegate.contentAttr;

    this.createDummySvg(classAttr);

    const observable = InlineSvgDirective.cache[this.src] ?
    of(InlineSvgDirective.cache[this.src]) :
    this.http.get(this.src, {responseType: 'text' as 'text'});

    observable.subscribe(x => {
      InlineSvgDirective.cache[this.src] = x;
      this.createSvg(classAttr, x);
      this.loadPreview.emit();
    });
    // observable.subscribe(x => {
      // InlineSvgDirective.cache[this.src] = x;
      // this.createSvg(classAttr, x.text());
      // this.loadPreview.emit();
    // });
  }

  // Fix for layout crashing while real svg loading
  createDummySvg(classAttr) {
    const div = <any>document.createElement('div');
    div.innerHTML = `<svg ${classAttr}><path d="M10 10 H 90 V 90 H 10 L 10 10" style="fill:transparent"/></svg>`;
    const dummySvg = <any>div.querySelector('svg');
    dummySvg.setAttribute(classAttr, '');
    if (this.el.nativeElement.classList) {
      dummySvg.classList.value = this.el.nativeElement.classList.value;
    }
    this.setStyleAttr(dummySvg);
    this.el.nativeElement.replaceWith(dummySvg);
    this.el.nativeElement = dummySvg;
  }

  createSvg(classAttr, svgContent) {
    const div = document.createElement('div');
    div.innerHTML = svgContent;
    const svg = <any>div.querySelector('svg');
    svg.setAttribute(classAttr, '');
    if (svg.classList) {
      svg.classList.value = this.el.nativeElement.classList.value;
    }
    this.setStyleAttr(svg);
    this.el.nativeElement.replaceWith(svg);
  }

  setStyleAttr(svg: any) {
    if (svg.setAttribute) {
      svg.setAttribute(this.styleAttr, '');
    }
    if (svg.childNodes && svg.childNodes.length) {
      (<any>svg.childNodes).forEach(x => this.setStyleAttr(x));
    }
  }
}
