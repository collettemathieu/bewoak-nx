import { Component, Input } from '@angular/core';
import { Item } from '../../../shared/models/item';

@Component({
  selector: 'bw-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewItemComponent {
  @Input()
  public item: Item;
}
