import { Injectable } from '@angular/core';
import { NodeType } from 'app/shared/components/organize-browser/browser-types';

@Injectable()
export class ItemImagePreviewService {

  constructor() {
  }

  getPreviewImg(item) {
    const fileType = item.name.split('.').pop().toLowerCase();
    if (item.isFolder()) {
      return '/img/svg/tile/folder.svg';
    } else if (item.getNodeType() === NodeType.Record) {
      return '/img/svg/file-types/record.svg';
    } else {
      const knownTypes = ' .pdf .xls .xlsx .doc .docx .ppt .pptx' +
        ' .zip .rar .7z .arj .wav .l.p3 .ogg .aac .wma .ape .flac' +
        ' .tif .tiff .gif .jpeg .jpg .jif .jfif .jp2 .jpx .j2k .fpx .pcd .png .bmp' +
        ' .mpg .mpeg .mp4 .txt .rtf .csv .tsv .xml .html .htm' +
        ' .mol .sdf .cdx .rxn .rdf .jdx .dx .cif';
      if (knownTypes.indexOf(' .' + fileType) < 0) {
        return item.type === 'Record' ? '/img/svg/file-types/record.svg' : '/img/svg/tile/file.svg';
      } else {
        return `/img/svg/file-types/${fileType}.svg`;
      }
    }
  }
}
