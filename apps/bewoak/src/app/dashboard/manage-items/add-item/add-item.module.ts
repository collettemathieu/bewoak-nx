import { NgModule } from '@angular/core';
import { AddItemModalComponent } from './add-item-modal.component';
import { AddArticleFormComponent } from './add-article-form/add-article-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddItemModalComponent, AddArticleFormComponent],
  imports: [SharedModule, ReactiveFormsModule],
  entryComponents: [AddItemModalComponent],
})
export class AddItemModule {}
