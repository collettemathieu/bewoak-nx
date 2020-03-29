import { NgModule } from '@angular/core';

import { ManageArticlesRoutingModule } from './manage-articles-routing.module';
import { AddArticleComponent } from './add-article/add-article.component';
import { ViewArticleComponent } from './view-article/view-article.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiCrossRefServiceService } from '../../core/services/article/api-cross-ref-service.service';
import { DoiService } from '../../core/services/article/doi.service';
import { RemoveArticleComponent } from './remove-article/remove-article.component';
import { AddArticleModule } from './add-article/add-article.module';


@NgModule({
  declarations: [ViewArticleComponent, RemoveArticleComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageArticlesRoutingModule,
    AddArticleModule
  ],
  providers: [ApiCrossRefServiceService, DoiService],
  exports: [AddArticleComponent, ViewArticleComponent],

})
export class ManageArticlesModule { }
