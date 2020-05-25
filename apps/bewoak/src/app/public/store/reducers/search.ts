import { Course } from '../../../shared/models/course';
import { SearchActions, SearchActionTypes } from '../actions/search';


export interface State {
    searchQuery: string,
    searchResults: Course[] | null
}

const initialState: State = {
    searchQuery: '',
    searchResults: null
}

export function reducer(state: State = initialState, action: SearchActions): State {
    switch (action.type) {
        case SearchActionTypes.Search:
            return {
                ...state,
                searchQuery: action.payload.searchQuery,
                searchResults: null
            }
        case SearchActionTypes.SearchSuccess:
            return {
                ...state,
                searchResults: action.payload.searchResults
            }
        default:
            return state;
    }
}