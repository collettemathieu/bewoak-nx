import { NgModule } from '@angular/core';
import { AddArticleComponent } from './add-article.component';
import { AddArticleModalComponent } from './add-article-modal/add-article-modal.component';
import { AddArticleFormComponent } from './add-article-form/add-article-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddArticleComponent, AddArticleModalComponent, AddArticleFormComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  exports:[AddArticleComponent],
  entryComponents: [AddArticleModalComponent]
})
export class AddArticleModule { }
