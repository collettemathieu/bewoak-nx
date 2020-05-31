import { User } from '../../shared/models/user';
import { CurrentUserActionTypes, CurrentUserActions } from '../actions/user';


export interface State {
    currentUser: User | null
}

const initialState: State = {
    currentUser: null
}

export function reducer(state: State = initialState, action: CurrentUserActions) {
    switch (action.type) {
        case CurrentUserActionTypes.Load:
            return {
                ...state,
                currentUser: action.payload.user
            }
        case CurrentUserActionTypes.Update:
            return {
                ...state,
                currentUser: action.payload.user
            }
        case CurrentUserActionTypes.Reset:
            return {
                ...state,
                currentUser: null
            }
        default:
            return state;
    }
}
