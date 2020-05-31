import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCurrentUser from './reducers/user';
import { CurrentUserEffects } from './effects/user';
import * as fromUserActions from './actions/user';

export interface RootState {
    currentUser: fromCurrentUser.State
}
export interface State {
    root: RootState
}
export const reducers = {
    root: fromCurrentUser.reducer
}
export const effects = [CurrentUserEffects];
export const { LoadCurrentUserAction, UpdateCurrentUserAction, ResetCurrentUserAction } = fromUserActions;

// Les sélecteurs pour le module Root
export const getRootState = createFeatureSelector<RootState>('root');
export const getCurrentUser = createSelector(getRootState, state => state.currentUser);
