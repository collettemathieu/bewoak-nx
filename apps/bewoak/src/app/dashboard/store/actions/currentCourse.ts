import { Action } from '@ngrx/store';
import { Course } from '../../../shared/models/course';

export enum CurrentCourseActionTypes {
    Load = '[Course] load a user course',
    LoadSuccess = '[Course] load a user course with success',
    Update = '[Course] update a user course'
}

export class LoadCurrentCourse implements Action {
    readonly type = CurrentCourseActionTypes.Load;

    constructor(public readonly payload: { idCourse: string }) { }
}

export class LoadCurrentCourseSuccess implements Action {
    readonly type = CurrentCourseActionTypes.LoadSuccess;

    constructor(public readonly payload: { course: Course }) { }
}

export class UpdateCurrentCourse implements Action {
    readonly type = CurrentCourseActionTypes.Update;

    constructor(public readonly payload: { course: Course }) { }
}

export type UserCourseAction = LoadCurrentCourse | LoadCurrentCourseSuccess | UpdateCurrentCourse;