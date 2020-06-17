import { CourseAction, CourseActionTypes } from '../actions/course';
import { Course } from '../../shared/models/course';

export interface State {
    loading: boolean,
    course: Course | null,
}

export const InitialState = {
    loading: false,
    course: null,
}

export function reducer(state: State = InitialState, action: CourseAction): State {
    switch (action.type) {
        case CourseActionTypes.Load:
            return {
                ...state,
                loading: true
            }
        case CourseActionTypes.LoadSuccess:
            return {
                ...state,
                loading: false,
                course: action.payload.course
            }
        case CourseActionTypes.Reset:
            return {
                ...state,
                loading: false,
                course: null
            }
        default:
            return state;
    }
}