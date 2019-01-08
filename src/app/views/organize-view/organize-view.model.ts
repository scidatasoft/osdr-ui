import { BrowserDataItem, NodeType, SubType } from 'app/shared/components/organize-browser/browser-types';
import { MatMenu } from '@angular/material';
import { AuthService } from 'app/core/services/auth/auth.service';

export class PropertyType {
  name: string;
  value: string;
  group?: string;

  constructor(name: string, value: string, group?: string) {
    this.name = name;
    this.value = value;
    this.group = '';
  }

  getKey(): string {
    return this.name;
  }

  getName(): string {
    return this.name;
  }
}

export class ContextMenu {
  static CREATE = 'Create Folder';
  static DELETE = 'Delete';
  static RENAME = 'Rename';
  static MOVE = 'Move';
  static TRAIN_ML_MODEL = 'Train Model';
  static UPLOAD = 'Upload Files';
  static RUN_ML_PREDICTION = 'Predict Properties';
  static DOWNLOAD = 'Download';
  static UPLOAD_WEB_PAGE = 'Upload Web Page';
  static EXPORT = 'Export File';
  static SHARING_SETTINGS = 'Sharing Settings';
  static CREATE_PUBLIC_LINK = 'Create Public Link';
  static CHANGE_SHARING_SETTINGS = 'Change Sharing Settings';
  // static MACHINE_LEARNING = 'Machine Learning';
  static EXPORT_TO_CSV = 'Export to CSV';
  static EXPORT_TO_SDF = 'Export to SDF';
  static EXPORT_TO_SPL = 'Export to SPL';
  static ENTITY_LOCATION = 'Go to the file location';
}

export class ActionMenuItemData {
  name: string;
  imagePath: string;
  enabled: boolean;
  visible: boolean;
  htmlTemplate: string;
  menuEl: MatMenu;

  subItems: ActionMenuItemData[] = [];

  click: (item: any) => void;

  html(item): string {
    return this.htmlTemplate;
  }

  setMenu(menuEl: MatMenu) {
    this.menuEl = menuEl;
  }

  img(item): string {
    return this.imagePath;
  }


  isEnabled(item: any): boolean {
    return this.enabled;
  }

  isVisible(item: any): boolean {
    return this.visible;
  }

  constructor(html: string, img: string, enabled: boolean, visible: boolean, click: (item: any) => void) {
    this.name = html;
    this.htmlTemplate = html;
    this.imagePath = img;
    this.enabled = enabled;
    this.visible = visible;
    this.click = click;
  }

}

export abstract class BaseMenuItemsManager {
  selectedItem: BrowserDataItem[] = [];
  contextMenuFolderActions: ActionMenuItemData[] = [];

  add(item: ActionMenuItemData) {
    this.contextMenuFolderActions.push(item);
  }

  abstract changeItemsAccessibility(actionSource: number);

  getItems(actionSource: number): ActionMenuItemData[] {
    this.changeItemsAccessibility(actionSource);
    return this.contextMenuFolderActions;
  }
}

export class AddMenuItemsManager extends BaseMenuItemsManager {
  changeItemsAccessibility(actionSource: number) {
    for (const menuItem of this.contextMenuFolderActions) {
      menuItem.visible = true;
      menuItem.enabled = true;
    }
  }
}

export class ActionMenuItemsManager extends BaseMenuItemsManager {
  public static SOURCE_TOOLBAR = 0;
  public static SOURCE_FILE_BROWSER = 1;
  public static SOURCE_WHITE_AREA = 2;
  private _filtered = false;

  get filtered(): boolean {
    return this._filtered;
  }

  set filtered(value: boolean) {
    this._filtered = value;
  }

  changeItemsAccessibility(actionSource: number) {

    for (const menuItem of this.contextMenuFolderActions) {
      if (this.filtered === true) {
        if (!this.isRecord()) {
          switch (actionSource) {
            case ActionMenuItemsManager.SOURCE_TOOLBAR:
              if (this.selectedItem.length === 0) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    if (subItem.name === ContextMenu.EXPORT_TO_CSV
                      || subItem.name === ContextMenu.EXPORT_TO_SDF
                      || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                      subItem.visible = false;
                      subItem.enabled = false;
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else if (this.selectedItem.length === 1 && this.selectedItem[0].authorizedOwner) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.ENTITY_LOCATION) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = true;
                  menuItem.enabled = this.hasSupportedExportExtension();
                  for (const subItem of menuItem.subItems) {
                    if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                      || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                      || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                      subItem.visible = true;
                      subItem.enabled = this.hasSupportedExportExtension();
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              } else if (this.selectedItem.every(x => x.authorizedOwner)) {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.RENAME) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else {
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              } else {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else if (menuItem.name === ContextMenu.RENAME) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else {
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              }
              break;
            case ActionMenuItemsManager.SOURCE_FILE_BROWSER:
              if (this.selectedItem.length === 0) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else if (this.selectedItem.length === 1 && this.selectedItem[0].authorizedOwner) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.ENTITY_LOCATION) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                  menuItem.visible = this.isDownloadable();
                  menuItem.enabled = this.isDownloadable();
                // } else if (menuItem.name === ContextMenu.MACHINE_LEARNING) {
                //   menuItem.visible = this.isSelectedSDF();
                //   menuItem.enabled = this.isSelectedSDF();
                //   for (const subItem of menuItem.subItems) {
                //     if (subItem.name === ContextMenu.TRAIN_ML_MODEL
                //       || subItem.name === ContextMenu.RUN_ML_PREDICTION) {
                //       subItem.visible = this.isSelectedSDF();
                //       subItem.enabled = this.isSelectedSDF();
                //     }
                //   }
              } else if (menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = this.hasSupportedExportExtension();
                  menuItem.enabled = this.hasSupportedExportExtension();
                  for (const subItem of menuItem.subItems) {
                    if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                      || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                      || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                      subItem.visible = this.hasSupportedExportExtension();
                      subItem.enabled = this.hasSupportedExportExtension();
                    }
                  }
                } else if (menuItem.name === ContextMenu.SHARING_SETTINGS) {
                  menuItem.visible = !this.selectedItem[0].isFolder();
                  menuItem.enabled = !this.selectedItem[0].isFolder();
                  for (const subItem of menuItem.subItems) {
                    if (subItem.name === ContextMenu.CREATE_PUBLIC_LINK) {
                      subItem.visible = !this.isShared();
                      subItem.enabled = !this.selectedItem[0].isFolder();
                    } else if (subItem.name === ContextMenu.CHANGE_SHARING_SETTINGS) {
                      subItem.visible = this.isShared();
                      subItem.enabled = !this.selectedItem[0].isFolder();
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else if (this.selectedItem.every(x => x.authorizedOwner)) {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.RENAME) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else {
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              } else {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else if (menuItem.name === ContextMenu.RENAME) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else {
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              }
              break;
            case ActionMenuItemsManager.SOURCE_WHITE_AREA:
              menuItem.visible = true;
              menuItem.enabled = false;
              break;
            default:
              menuItem.visible = false;
              menuItem.enabled = false;
              for (const subItem of menuItem.subItems) {
                subItem.visible = false;
                subItem.enabled = false;
              }
          }
        } else {
          switch (actionSource) {
            case ActionMenuItemsManager.SOURCE_TOOLBAR:
              if (this.selectedItem.length === 0) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    if (subItem.name === ContextMenu.EXPORT_TO_CSV
                      || subItem.name === ContextMenu.EXPORT_TO_SDF
                      || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                      subItem.visible = false;
                      subItem.enabled = false;
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else if (this.selectedItem.length === 1) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.ENTITY_LOCATION) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = true;
                  menuItem.enabled = this.hasSupportedExportExtension();
                  for (const subItem of menuItem.subItems) {
                    if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                      || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                      || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                      subItem.visible = true;
                      subItem.enabled = this.hasSupportedExportExtension();
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              } else {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.RENAME) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else {
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                  menuItem.visible = false;
                  menuItem.enabled = false;
                  for (const subItem of menuItem.subItems) {
                    subItem.visible = false;
                    subItem.enabled = false;
                  }
                }
              }
              break;
            case ActionMenuItemsManager.SOURCE_FILE_BROWSER:
              if (this.selectedItem.length === 0) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE) {
                  menuItem.visible = true;
                  menuItem.enabled = false;
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else if (this.selectedItem.length === 1) {
                if (menuItem.name === ContextMenu.DELETE
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.MOVE
                  || menuItem.name === ContextMenu.ENTITY_LOCATION) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                  menuItem.visible = this.isDownloadable();
                  menuItem.enabled = this.isDownloadable();
                // } else if (menuItem.name === ContextMenu.MACHINE_LEARNING) {
                //   menuItem.visible = this.isSelectedSDF();
                //   menuItem.enabled = this.isSelectedSDF();
                //   for (const subItem of menuItem.subItems) {
                //     if (subItem.name === ContextMenu.TRAIN_ML_MODEL
                //       || subItem.name === ContextMenu.RUN_ML_PREDICTION) {
                //       subItem.visible = this.isSelectedSDF();
                //       subItem.enabled = this.isSelectedSDF();
                //     }
                //   }
                } else if (menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = this.hasSupportedExportExtension();
                  menuItem.enabled = this.hasSupportedExportExtension();
                  for (const subItem of menuItem.subItems) {
                    if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                      || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                      || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                      subItem.visible = this.hasSupportedExportExtension();
                      subItem.enabled = this.hasSupportedExportExtension();
                    }
                  }
                } else if (menuItem.name === ContextMenu.SHARING_SETTINGS) {
                  menuItem.visible = !this.selectedItem[0].isFolder();
                  menuItem.enabled = !this.selectedItem[0].isFolder();
                  for (const subItem of menuItem.subItems) {
                    if (subItem.name === ContextMenu.CREATE_PUBLIC_LINK) {
                      subItem.visible = !this.isShared();
                      subItem.enabled = !this.selectedItem[0].isFolder();
                    } else if (subItem.name === ContextMenu.CHANGE_SHARING_SETTINGS) {
                      subItem.visible = this.isShared();
                      subItem.enabled = !this.selectedItem[0].isFolder();
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              } else {
                if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE
                ) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                } else if (menuItem.name === ContextMenu.DOWNLOAD
                  || menuItem.name === ContextMenu.RENAME
                  || menuItem.name === ContextMenu.EXPORT) {
                  menuItem.visible = true;
                  menuItem.enabled = true;
                  for (const subItem of menuItem.subItems) {
                    if (subItem.name === ContextMenu.EXPORT_TO_CSV
                      || subItem.name === ContextMenu.EXPORT_TO_SDF
                      || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                      subItem.visible = true;
                      subItem.enabled = false;
                    }
                  }
                } else {
                  menuItem.visible = false;
                  menuItem.enabled = false;
                }
              }
              break;
            case ActionMenuItemsManager.SOURCE_WHITE_AREA:
              menuItem.visible = true;
              menuItem.enabled = false;
              break;
            default:
              menuItem.visible = false;
              menuItem.enabled = false;
              for (const subItem of menuItem.subItems) {
                subItem.visible = false;
                subItem.enabled = false;
              }
          }
        }
      } else {
        switch (actionSource) {
          case ActionMenuItemsManager.SOURCE_TOOLBAR:
            if (this.selectedItem.length === 0) {
              if (menuItem.name === ContextMenu.DELETE
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.MOVE
                || menuItem.name === ContextMenu.EXPORT) {
                menuItem.visible = true;
                menuItem.enabled = false;
                for (const subItem of menuItem.subItems) {
                  if (subItem.name === ContextMenu.EXPORT_TO_CSV
                    || subItem.name === ContextMenu.EXPORT_TO_SDF
                    || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                    subItem.visible = true;
                    subItem.enabled = false;
                  }
                }
              } else if (menuItem.name === ContextMenu.UPLOAD_WEB_PAGE) {
                menuItem.visible = true;
                menuItem.enabled = true;
              } else {
                for (const subItem of menuItem.subItems) {
                  subItem.visible = false;
                  subItem.enabled = false;
                }
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            } else if (this.selectedItem.length === 1) {
              if (menuItem.name === ContextMenu.DELETE
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.MOVE) {
                menuItem.visible = true;
                menuItem.enabled = true;
              } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                menuItem.visible = this.isDownloadable();
                menuItem.enabled = this.isDownloadable();
              } else if (menuItem.name === ContextMenu.EXPORT) {
                menuItem.visible = true;
                menuItem.enabled = this.hasSupportedExportExtension();
                for (const subItem of menuItem.subItems) {
                  if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                    || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                    || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                    subItem.visible = true;
                    subItem.enabled = this.hasSupportedExportExtension();
                  }
                }
              } else if (menuItem.name === ContextMenu.SHARING_SETTINGS) {
                menuItem.visible = !this.selectedItem[0].isFolder();
                menuItem.enabled = !this.selectedItem[0].isFolder();
                for (const subItem of menuItem.subItems) {
                  if (subItem.name === ContextMenu.CREATE_PUBLIC_LINK) {
                    subItem.visible = !this.isShared();
                    subItem.enabled = !this.selectedItem[0].isFolder();
                  } else if (subItem.name === ContextMenu.CHANGE_SHARING_SETTINGS) {
                    subItem.visible = this.isShared();
                    subItem.enabled = !this.selectedItem[0].isFolder();
                  }
                }
              // } else if (menuItem.name === ContextMenu.MACHINE_LEARNING) {
              //   menuItem.visible = this.isSelectedSDF();
              //   menuItem.enabled = this.isSelectedSDF();
              //   for (const subItem of menuItem.subItems) {
              //     if (subItem.name === ContextMenu.TRAIN_ML_MODEL
              //       || subItem.name === ContextMenu.RUN_ML_PREDICTION) {
              //       subItem.visible = this.isSelectedSDF();
              //       subItem.enabled = this.isSelectedSDF();
              //     }
              //   }
              } else {
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            } else {
              if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE) {
                menuItem.visible = true;
                menuItem.enabled = true;
              } else if (menuItem.name === ContextMenu.DOWNLOAD
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.EXPORT) {
                menuItem.visible = true;
                menuItem.enabled = false;
                for (const subItem of menuItem.subItems) {
                  if (subItem.name === ContextMenu.EXPORT_TO_CSV
                    || subItem.name === ContextMenu.EXPORT_TO_SDF
                    || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                    subItem.visible = true;
                    subItem.enabled = false;
                  }
                }
              } else {
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            }
            break;
          case ActionMenuItemsManager.SOURCE_FILE_BROWSER:
            if (this.selectedItem.length === 0) {
              if (menuItem.name === ContextMenu.DELETE
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.MOVE) {
                menuItem.visible = true;
                menuItem.enabled = false;
              } else if (menuItem.name === ContextMenu.UPLOAD_WEB_PAGE) {
                menuItem.visible = false;
                menuItem.enabled = false;
              } else {
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            } else if (this.selectedItem.length === 1) {
              if (menuItem.name === ContextMenu.DELETE
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.MOVE) {
                menuItem.visible = true;
                menuItem.enabled = true;
              } else if (menuItem.name === ContextMenu.DOWNLOAD) {
                menuItem.visible = this.isDownloadable();
                menuItem.enabled = this.isDownloadable();
              // } else if (menuItem.name === ContextMenu.MACHINE_LEARNING) {
              //   menuItem.visible = this.isSelectedSDF();
              //   menuItem.enabled = this.isSelectedSDF();
              //   for (const subItem of menuItem.subItems) {
              //     if (subItem.name === ContextMenu.TRAIN_ML_MODEL
              //       || subItem.name === ContextMenu.RUN_ML_PREDICTION) {
              //       subItem.visible = this.isSelectedSDF();
              //       subItem.enabled = this.isSelectedSDF();
              //     }
              //   }
              } else if (menuItem.name === ContextMenu.EXPORT) {
                menuItem.visible = true;
                menuItem.enabled = this.hasSupportedExportExtension();
                for (const subItem of menuItem.subItems) {
                  if ((subItem.name === ContextMenu.EXPORT_TO_CSV && this.selectedItemExtension() !== 'csv')
                    || (subItem.name === ContextMenu.EXPORT_TO_SDF && this.selectedItemExtension() !== 'sdf')
                    || (subItem.name === ContextMenu.EXPORT_TO_SPL && this.selectedItemExtension() !== 'spl')) {
                    subItem.visible = true;
                    subItem.enabled = this.hasSupportedExportExtension();
                  }
                }
              } else if (menuItem.name === ContextMenu.SHARING_SETTINGS) {
                menuItem.visible = !this.selectedItem[0].isFolder();
                menuItem.enabled = !this.selectedItem[0].isFolder();
                for (const subItem of menuItem.subItems) {
                  if (subItem.name === ContextMenu.CREATE_PUBLIC_LINK) {
                    subItem.visible = !this.isShared();
                    subItem.enabled = !this.selectedItem[0].isFolder();
                  } else if (subItem.name === ContextMenu.CHANGE_SHARING_SETTINGS) {
                    subItem.visible = this.isShared();
                    subItem.enabled = !this.selectedItem[0].isFolder();
                  }
                }
              } else {
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            } else {
              if (menuItem.name === ContextMenu.DELETE || menuItem.name === ContextMenu.MOVE
              ) {
                menuItem.visible = true;
                menuItem.enabled = true;
              } else if (menuItem.name === ContextMenu.DOWNLOAD
                || menuItem.name === ContextMenu.RENAME
                || menuItem.name === ContextMenu.EXPORT) {
                menuItem.visible = true;
                menuItem.enabled = false;
                for (const subItem of menuItem.subItems) {
                  if (subItem.name === ContextMenu.EXPORT_TO_CSV
                    || subItem.name === ContextMenu.EXPORT_TO_SDF
                    || subItem.name === ContextMenu.EXPORT_TO_SPL) {
                    subItem.visible = true;
                    subItem.enabled = false;
                  }
                }
              } else {
                menuItem.visible = false;
                menuItem.enabled = false;
              }
            }
            break;
          case ActionMenuItemsManager.SOURCE_WHITE_AREA:
              menuItem.visible = true;
              menuItem.enabled = true;
            if (menuItem.name === ContextMenu.UPLOAD || menuItem.name === ContextMenu.CREATE) {
              menuItem.visible = true;
              menuItem.enabled = true;
            } else {
              menuItem.visible = false;
              menuItem.enabled = false;
            }
            break;
          default:
            menuItem.visible = false;
            menuItem.enabled = false;
            for (const subItem of menuItem.subItems) {
              subItem.visible = false;
              subItem.enabled = false;
            }
        }
      }
    }
  }

  isDownloadable(): boolean {

    if (this.selectedItem.length === 0 || this.selectedItem.length > 1) {
      return false;
    }

    for (const item of this.selectedItem) {
      if (item.isFolder()) {
        return false;
      }
    }

    return true;
  }

  private isSelectedSDF(): boolean {
    let selectionSimilar = true;
    if (this.selectedItem.length === 0) {
      return false;
    }

    for (const item of this.selectedItem) {
      if (item.isFolder() || item.getFileExtension() !== 'sdf') {
        selectionSimilar = false;
      }
    }
    return selectionSimilar;
  }

  private isRecord(): boolean {
    let selectionSimilar = true;
    if (this.selectedItem.length === 0) {
      return false;
    }

    for (const item of this.selectedItem) {
      if (item.isFolder() || item.getNodeType() !== NodeType.Record) {
        selectionSimilar = false;
      }
    }
    return selectionSimilar;
  }

  hasSupportedExportExtension(): boolean {
    return this.selectedItem.every(item =>
      item.getFileExtension() === 'mol'
      || item.getFileExtension() === 'cdx'
      || item.getFileExtension() === 'sdf');
  }

  selectedItemExtension() {
    return this.selectedItem[0].getFileExtension();
  }

  isShared() {
    return this.selectedItem.some(x => x.accessPermissions && x.accessPermissions.isPublic);
  }
}
