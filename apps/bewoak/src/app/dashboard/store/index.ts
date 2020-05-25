import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserCourses from './reducers/userCourses';
import * as fromCurrentCourse from './reducers/currentCourse';
import { UserCoursesEffect } from './effects/userCourses';
import * as fromUserCoursesActions from './actions/userCourses';
import * as fromCurrentCourseActions from './actions/currentCourse';
import { CurrentCourseEffect } from './effects/currentCourse';

export interface DashBoardState {
    userCourses: fromUserCourses.State,
    currentCourse: fromCurrentCourse.State
}
export interface State {
    dashBoardPage: DashBoardState
}
export const reducers = {
    userCourses: fromUserCourses.reducer,
    currentCourse: fromCurrentCourse.reducer
}
export const effects = [UserCoursesEffect, CurrentCourseEffect];
export const { LoadUserCourses, AddUserCourse, RemoveUserCourse } = fromUserCoursesActions;
export const { LoadCurrentCourse, UpdateCurrentCourse } = fromCurrentCourseActions;

// Les sélecteurs pour le module DashBoard
export const getPublicState = createFeatureSelector<DashBoardState>('dashBoardPage');
export const getUserCourses = createSelector(getPublicState, state => state.userCourses.userCourses);
export const getCurrentCourse = createSelector(getPublicState, state => state.currentCourse.course);