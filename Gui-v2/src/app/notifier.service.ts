import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Generic service for notifying components of various events
// Initially just used for notifying the home component to reload plugins, but could be used for other things
// Will look to break it up into more specific services as needed

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  pluginsReloaded = new Subject<void>();

  constructor() { }

  /**
   * Notify that user plugins were reloaded
   */
  pluginsWereReloaded(): void {
    this.pluginsReloaded.next();
  }

  /**
   * Register to be notified when user plugins are reloaded
   * @returns an observable that will fire when user plugins are reloaded
   */
  onPluginsReloaded(): Observable<void> {
    return this.pluginsReloaded.asObservable();
  }

}