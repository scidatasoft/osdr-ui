import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[drFileDragDrop]',
})
export class FileDragDropDirective implements OnInit {
  @Input() hoverClass: string;
  @Input() drFileDragDrop: boolean;
  @Output() fileDrop: EventEmitter<any> = new EventEmitter();

  private dragentered = false;
  private dragleaveTimeout;
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (!this.drFileDragDrop) { return; }
    this.el.nativeElement.ondragenter = (e) => {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.stopPropagation();
        this.dragentered = true;
        this.addHoverClass();
      }
      return false;
    };
    this.el.nativeElement.ondragleave = (e) => {
      e.stopPropagation();
      this.removeHoverClass();
      return false;
    };
    this.el.nativeElement.ondragover = (e) => {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.stopPropagation();
        this.addHoverClass();
      }
      return false;
    };
    this.el.nativeElement.ondragend = (e) => {
      e.stopPropagation();
      this.removeHoverClass();
      return false;
    };
    this.el.nativeElement.ondrop = (e) => {
      e.preventDefault();
      this.removeHoverClass();
      this.onFileDrop(e);
    };
  }

  addHoverClass() {
    clearTimeout(this.dragleaveTimeout);
    if (this.hoverClass) { this.el.nativeElement.classList.add(this.hoverClass); }
  }

  removeHoverClass() {
    this.dragentered = false;
    clearTimeout(this.dragleaveTimeout);
    this.dragleaveTimeout = setTimeout(() => {
      if (!this.dragentered) {
        if (this.hoverClass) { this.el.nativeElement.classList.remove(this.hoverClass); }
      }
    }, 50);
  }

  onFileDrop(e) {
    this.fileDrop.emit(e);
  }
}
