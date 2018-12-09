import {ToolbarButtonType} from 'app/shared/components/organize-toolbar/organize-toolbar.model';

export class BasePreview {

  activeToolbarButtons: ToolbarButtonType[] = [];

  getActiveButtons(): ToolbarButtonType[] {
    return this.activeToolbarButtons;
  }

  refreshData(data?: any) {
  }

  getToolbarButtons(): ToolbarButtonType[] {
    return [];
  }

  setCurrentPage(page: any) {
  }

  toolBarEvent(button: ToolbarButtonType) {
  }
}
