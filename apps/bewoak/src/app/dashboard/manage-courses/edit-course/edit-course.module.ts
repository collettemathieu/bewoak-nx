import { NgModule } from '@angular/core';
import { EditCourseComponent } from './edit-course.component';
import { PlusDotsComponent } from './plus-dots/plus-dots.component';
import { SharedModule } from '../../../shared/shared.module';
import { EditCourseRoutingModule } from './edit-course-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageArticlesModule } from '../../manage-articles/manage-articles.module';


@NgModule({
  declarations: [EditCourseComponent, PlusDotsComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ManageArticlesModule,
    EditCourseRoutingModule
  ]
})
export class EditCourseModule { }
