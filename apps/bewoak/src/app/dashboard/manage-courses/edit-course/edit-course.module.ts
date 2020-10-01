import { NgModule } from '@angular/core';
import { EditCourseComponent } from './edit-course.component';
import { SharedModule } from '../../../shared/shared.module';
import { EditCourseRoutingModule } from './edit-course-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageItemsModule } from '../../manage-items/manage-items.module';

@NgModule({
  declarations: [EditCourseComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageItemsModule,
    EditCourseRoutingModule,
  ],
})
export class EditCourseModule {}
