import {NgZone} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

export class UploadInfoBoxElement {
  name = '';
  uploadTask: Observable<any>;
  taskSubscription: Subscription;
  inProgress = false;
  canceled = false;
  finished = false;
  finishedWithError = false;
  uploadPath = '';

  finishUploadEvent: () => void;

  constructor(name: string, private ngZone: NgZone, finishUploadEvent?: () => void) {
    this.name = name;
    this.finishUploadEvent = finishUploadEvent;
  }

  getShortName(): string {
    if (this.name.length > 25) {
      return this.name.slice(0, 25) + ' ...';
    }

    return this.name;
  }

  startProgress() {
    if (this.inProgress === false) {
      this.inProgress = true;
      this.ngZone.runOutsideAngular(
        () => {
          this.taskSubscription = this.uploadTask.subscribe(
            (response: Response) => {
              this.ngZone.run(
                () => {
                  this.finishTasks();
                },
              );
            },
            (error) => {
              this.ngZone.run(
                () => {
                  this.finishTasksWithError();
                },
              );
            },
          );
        },
      );
    }
  }

  restartUpload() {
    this.canceled = false;
    this.finishedWithError = false;
    this.startProgress();
  }

  cancelTask() {
    this.taskSubscription.unsubscribe();
    this.canceled = true;
    this.inProgress = false;
  }

  finishTasks() {
    this.finished = true;
    this.inProgress = false;
    if (this.finishUploadEvent) {
      this.finishUploadEvent();
    }
  }

  finishTasksWithError() {
    this.finishedWithError = true;
    this.inProgress = false;
    if (this.finishUploadEvent) {
      this.finishUploadEvent();
    }
  }
}
