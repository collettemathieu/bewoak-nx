import { NgModule } from '@angular/core';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { SharedModule } from '../../shared/shared.module';
import { CourseDetailModalComponent } from './course-detail-modal/course-detail-modal.component';


@NgModule({
  declarations: [CourseComponent, CourseDetailModalComponent],
  imports: [
    SharedModule,
    CourseRoutingModule
  ],
  entryComponents: [CourseDetailModalComponent]
})
export class CourseModule { }
