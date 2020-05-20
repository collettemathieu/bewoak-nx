import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserCourses from './reducers/userCourses';
import { UserCoursesEffect } from './effects/userCourses';
import * as fromActions from './actions/userCourses';

export interface DashBoardState {
    userCourses: fromUserCourses.State
}
export interface State {
    dashBoardPage: DashBoardState
}
export const reducers = {
    userCourses: fromUserCourses.reducer
}
export const effects = [UserCoursesEffect];
export const LoadUserCourses = fromActions.LoadUserCourses;

// Les sélecteurs pour le module DashBoard
export const getPublicState = createFeatureSelector<DashBoardState>('dashBoardPage');
export const getUserCourses = createSelector(getPublicState, state => state.userCourses.userCourses);