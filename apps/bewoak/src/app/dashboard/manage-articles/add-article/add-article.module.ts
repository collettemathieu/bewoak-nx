import { NgModule } from '@angular/core';
import { AddArticleModalComponent } from './add-article-modal.component';
import { AddArticleFormComponent } from './add-article-form/add-article-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddArticleModalComponent, AddArticleFormComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddArticleModalComponent]
})
export class AddArticleModule { }
