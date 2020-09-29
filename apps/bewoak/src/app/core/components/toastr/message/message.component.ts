import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Toastr } from '../../../../shared/interface/toastr';

@Component({
  selector: 'bw-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input()
  public toastr: Toastr;

  @Output()
  private closeMessageEmitter: EventEmitter<Toastr> = new EventEmitter();

  constructor() {}

  public closeMessage() {
    this.closeMessageEmitter.emit(this.toastr);
  }
}
