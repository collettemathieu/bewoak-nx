import { NgModule } from '@angular/core';

import { ManageItemsRoutingModule } from './manage-items-routing.module';
import { ViewItemComponent } from './view-item/view-item.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiCrossRefService } from '@bewoak-nx/api-cross-ref';
import { DoiService } from '../../core/services/article/doi.service';
import { RemoveItemComponent } from './remove-item/remove-item.component';
import { AddItemModule } from './add-item/add-item.module';

@NgModule({
  declarations: [ViewItemComponent, RemoveItemComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageItemsRoutingModule,
    AddItemModule,
  ],
  providers: [ApiCrossRefService, DoiService],
  exports: [ViewItemComponent, RemoveItemComponent],
})
export class ManageItemsModule {}
