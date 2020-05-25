import { UserCourseAction, CurrentCourseActionTypes } from '../actions/currentCourse';
import { Course } from '../../../shared/models/course';

export interface State {
    loading: boolean,
    course: Course | null
}

export const InitialState = {
    loading: false,
    course: null
}

export function reducer(state: State = InitialState, action: UserCourseAction): State {
    switch (action.type) {
        case CurrentCourseActionTypes.Load:
            return {
                ...state,
                loading: true
            }
        case CurrentCourseActionTypes.LoadSuccess:
            return {
                ...state,
                loading: false,
                course: action.payload.course
            }
        case CurrentCourseActionTypes.Update:
            return {
                ...state,
                course: action.payload.course
            }
        default:
            return state;
    }
}