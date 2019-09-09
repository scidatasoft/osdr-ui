import { AbstractControl } from '@angular/forms';

import XRegExp from '../../../../../node_modules/xregexp';

export function ValidateFolderName(control: AbstractControl) {
  // const regexSpaces = /^[\s]+|[.\s]+$/g;
  const regexFolder = /^[a-zA-Z0-9А-Яа-яёЁ\-\.\_\s]+$/gi;
  // const regexFolder = XRegExp('^[\\pL\-\.\_\s0-9]+$');
  // const regexSpaces = /^[]+|[.]+$/g;
  const regexWindows = /\.(COM[0-9]|LPT[0-9]|CON|PRN|AUX|CLOCK\$|NUL)/ig;

  const spaces = regexFolder.test(control.value)
    // && !regexSpaces.test(control.value)
    && !regexWindows.test(control.value);

  if (!spaces) {
    return { invalidName: true };
  }
  return null;
}

export function ValidateWebPageUrl(control: AbstractControl) {
  const regex_wo_http = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\.%_~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
  return regex_wo_http.test(control.value) ? null : { notValidUrl: true };
}

export class ValidationMessages {

  web_page_validation_messages = [
    { type: 'notValidUrl', message: 'Please enter a valid web page URL' },
    { type: 'required', message: 'Please enter web page URL' },
  ];

  getNodeNameValidationMessages(nodeType: string) {
    return [
      { type: 'required', message: `You should enter ${nodeType.toLowerCase()} name` },
      { type: 'invalidName', message: `Invalid characters in the ${nodeType.toLowerCase()} name` },
      { type: 'maxlength', message: `${nodeType}  name cannot be more then 255 characters` },
    ];
  }

}
