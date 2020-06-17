import { Action } from '@ngrx/store';
import { Course } from '../../shared/models/course';

export enum CourseActionTypes {
    Load = '[Course] load a course',
    LoadSuccess = '[Course] load a course with success',
    Reset = '[Course] Reset the course',
}

export class LoadCourse implements Action {
    readonly type = CourseActionTypes.Load;

    constructor(public readonly payload: { idCourse: string }) { }
}

export class LoadCourseSuccess implements Action {
    readonly type = CourseActionTypes.LoadSuccess;

    constructor(public readonly payload: { course: Course }) { }
}

export class ResetCourseAction implements Action {
    readonly type = CourseActionTypes.Reset;
}



export type CourseAction = LoadCourse | LoadCourseSuccess | ResetCourseAction;