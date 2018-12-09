import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[drTooltip]',
})
export class TooltipDirective implements OnChanges, OnInit {

  @Input() drTooltip: string;
  $: any = (window as any).$;

  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    this.$(this.el.nativeElement).tooltip({title: this.drTooltip});
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
