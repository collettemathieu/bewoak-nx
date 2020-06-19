import { Action } from '@ngrx/store';
import { Course } from '../../../shared/models/course';

export enum CurrentCourseActionTypes {
    Load = '[Course] load a user course',
    LoadSuccess = '[Course] load a user course with success',
    Update = '[Course] update a user course',
    UpdateSuccess = '[Course] update success a user course',
    RefreshArticles = '[Course] refresh articles in current course',
    Reset = '[Course] reset the current course'
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

export class UpdateCurrentCourseSuccess implements Action {
    readonly type = CurrentCourseActionTypes.UpdateSuccess;

    constructor(public readonly payload: { course: Course }) { }
}

export class RefreshArticlesInCurrentCourse implements Action {
    readonly type = CurrentCourseActionTypes.RefreshArticles;

    constructor(public readonly payload: { course: Course }) { }
}

export class ResetCurrentCourse implements Action {
    readonly type = CurrentCourseActionTypes.Reset;
}

export type UserCourseAction = LoadCurrentCourse | LoadCurrentCourseSuccess | UpdateCurrentCourse |
    UpdateCurrentCourseSuccess | RefreshArticlesInCurrentCourse | ResetCurrentCourse;