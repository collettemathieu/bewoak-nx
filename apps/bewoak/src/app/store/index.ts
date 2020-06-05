import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCurrentUser from './reducers/user';
import { CurrentUserEffects } from './effects/user';
import * as fromUserActions from './actions/user';

export { State } from './reducers/user';
export const reducers = {
    root: fromCurrentUser.reducer
}
export const effects = [CurrentUserEffects];
export const { LoadCurrentUserAction, UpdateCurrentUserAction, ResetCurrentUserAction } = fromUserActions;

// Les sélecteurs pour le module Root
export const getRootState = createFeatureSelector<fromCurrentUser.State>('root');
export const getCurrentUser = createSelector(getRootState, state => state.currentUser);
