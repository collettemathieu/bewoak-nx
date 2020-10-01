import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../../../shared/models/item';
import { ItemService } from '../../../core/services/item/item.service';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentCourse,
  RefreshItemsInCurrentCourse,
} from '../../store';
import { Course } from '../../../shared/models/course';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bw-remove-item',
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.scss'],
})
export class RemoveItemComponent implements OnInit, OnDestroy {
  @Input()
  item: Item;

  private currentCourse: Course;
  private subscription: Subscription;

  constructor(private itemService: ItemService, private store: Store<State>) {}

  ngOnInit() {
    this.subscription = this.store
      .select(getCurrentCourse)
      .subscribe(
        (currentCourse: Course) => (this.currentCourse = currentCourse),
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Suppression logique du lien entre l'item et le parcours pédagogique courant.
   */
  public remove(): void {
    const courseIds = [...this.item.courseIds];
    const orderByCourseId = { ...this.item.orderByCourseId };
    const index = this.item.courseIds.findIndex((element) => {
      return element === this.currentCourse.id;
    });
    if (index === -1) {
      return;
    }
    courseIds.splice(index, 1);
    delete orderByCourseId[this.currentCourse.id];
    const item = Object.assign({}, this.item, {
      courseIds,
      orderByCourseId,
    });
    this.itemService.update(item).subscribe((_) => {
      this.store.dispatch(
        new RefreshItemsInCurrentCourse({ course: this.currentCourse }),
      );
    });
  }
}
