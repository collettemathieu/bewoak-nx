import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './reducers/search';
import { SearchEffects } from './effects/search';
import * as fromActions from './actions/search';

export interface PublicState {
    search: fromSearch.State
}
export interface State {
    publicPage: PublicState
}
export const reducers = {
    search: fromSearch.reducer
}
export const effects = [SearchEffects];
export const SearchAction = fromActions.SearchAction;

// Les sélecteurs pour le module Public
export const getPublicState = createFeatureSelector<PublicState>('publicPage');
export  const getSearchResults = createSelector(getPublicState, state => state.search.searchResults);