import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly $isLoading: Observable<boolean> = this.isLoading.asObservable();

  constructor() { }

  /*
  *  Active ou désactive le loader sur la page
  *  @param isLoading bool
  *  @return void
  */
  public setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }
}
