import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IModalState } from 'app/shared/components/organize-browser/browser-types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dr-chem-editor',
  templateUrl: './chem-editor.component.html',
  styleUrls: ['./chem-editor.component.scss']
})
export class ChemEditorComponent implements OnInit, IModalState {
  @ViewChild('staticModal', { static: true }) staticModal: any;
  @ViewChild('ketcher', { static: true }) iframe: ElementRef;
  public subscriptions: Subscription[] = [];
  visible: boolean;
  molData = '';
  private ketcherInstance: any;

  constructor() { }

  ngOnInit() {
  }

  openDialog() {
    this.staticModal.show();

    if (!this.ketcherInstance) {
      const doc =  this.iframe.nativeElement.contentWindow;
      this.ketcherInstance = doc.ketcher;
    }

    this.subscriptions.push(this.staticModal.onHidden.subscribe(() => {
      this.unsubscribe();
    }));
  }

  public unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onHideDialog() {
    this.staticModal.hide();
  }

  isVisible(): boolean {
    return this.subscriptions.length > 0;
  }

  onGetDataClick() {
    const molFile = this.ketcherInstance.getMolfile();
    const smilesFile = this.ketcherInstance.getSmiles();

    if (smilesFile && smilesFile.length > 0) {
      this.molData = molFile + '\n' + smilesFile;
      console.log(molFile);
      console.log(smilesFile);
    }
  }
}
