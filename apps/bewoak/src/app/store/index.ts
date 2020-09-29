import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCurrentUser from './reducers/user';
import { CurrentUserEffects } from './effects/user';
import * as fromUserActions from './actions/user';
import * as fromCourse from './reducers/course';
import { CourseEffects } from './effects/course';
import * as fromCourseActions from './actions/course';

export { State as StateUser } from './reducers/user';
export { State as StateCourse } from './reducers/course';

export const reducers = {
  user: fromCurrentUser.reducer,
  course: fromCourse.reducer,
};
export const effects = [CurrentUserEffects, CourseEffects];
export const {
  LoadCurrentUserAction,
  UpdateCurrentUserAction,
  ResetCurrentUserAction,
} = fromUserActions;
export const { LoadCourse, ResetCourseAction } = fromCourseActions;

// Les sélecteurs pour le module Root
export const getRootState = createFeatureSelector<fromCurrentUser.State>(
  'user',
);
export const getCurrentUser = createSelector(
  getRootState,
  (state) => state.currentUser,
);

export const getCourseState = createFeatureSelector<fromCourse.State>('course');
export const getCourse = createSelector(
  getCourseState,
  (state) => state.course,
);
