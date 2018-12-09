import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  ReflectiveInjector,
  ComponentFactoryResolver, OnInit, Output, EventEmitter
} from '@angular/core';
import { CommonOrganizeInfoBoxComponent } from '../common-organize-info-box/common-organize-info-box.component';
import { CvspOrganizeInfoBoxComponent } from '../cvsp-organize-info-box/cvsp-organize-info-box.component';


@Component({
  selector: 'dr-organize-info-box-factory',
  templateUrl: './organize-info-box-factory.component.html',
  styleUrls: ['./organize-info-box-factory.component.scss'],
  entryComponents: [CommonOrganizeInfoBoxComponent, CvspOrganizeInfoBoxComponent]
})

export class OrganizeInfoBoxFactoryComponent {
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) {
      return;
    }

    const inputProviders = Object.keys(data.inputs).map((inputName) => {
      return { provide: inputName, useValue: data.inputs[inputName] };
    });
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

    const factory = this.resolver.resolveComponentFactory(data.component);

    const component = factory.create(injector);

    this.dynamicComponentContainer.insert(component.hostView);

    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }

  @Output() onEditClick = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver) {
  }
}
