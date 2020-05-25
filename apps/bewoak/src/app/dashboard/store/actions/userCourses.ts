import { Action } from '@ngrx/store';
import { Course } from '../../../shared/models/course';

export enum UserCoursesActionTypes {
    Load = '[Courses] Load all courses for user',
    LoadSuccess = '[Courses] Load success all courses for user',
    Add = '[Courses] Add course for user',
    Remove = '[Courses] Remove course for user'
}

export class LoadUserCourses implements Action {
    readonly type = UserCoursesActionTypes.Load;

    constructor(public readonly payload: { userId: string }) { }
}

export class LoadUserCoursesSuccess implements Action {
    readonly type = UserCoursesActionTypes.LoadSuccess;

    constructor(public readonly payload: { courses: Course[] }) { }
}

export class AddUserCourse implements Action {
    readonly type = UserCoursesActionTypes.Add;

    constructor(public readonly payload: { course: Course }) { }
}

export class RemoveUserCourse implements Action {
    readonly type = UserCoursesActionTypes.Remove;

    constructor(public readonly payload: { course: Course }) { }
}

export type UserCoursesAction = LoadUserCourses | LoadUserCoursesSuccess | AddUserCourse | RemoveUserCourse;