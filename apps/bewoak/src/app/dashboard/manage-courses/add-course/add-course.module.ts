import { NgModule } from '@angular/core';
import { AddCourseComponent } from './add-course.component';
import { AddCourseFormComponent } from './add-course-form/add-course-form.component';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddCourseComponent, AddCourseFormComponent, AddCourseModalComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [AddCourseComponent],
  entryComponents: [AddCourseModalComponent]
})
export class AddCourseModule { }
