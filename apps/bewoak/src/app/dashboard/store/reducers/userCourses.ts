import { Course } from '../../../shared/models/course';
import { userCoursesAction, UserCoursesActionTypes } from '../actions/userCourses';


export interface State {
    loading: boolean,
    userCourses: Course[] | null
}

const initialState: State = {
    loading: false,
    userCourses: null
};

export function reducer(state = initialState, action: userCoursesAction) {
    switch (action.type) {
        case UserCoursesActionTypes.Load:
            return {
                ...state,
                loading: true
            };
        case UserCoursesActionTypes.LoadSuccess:
            return {
                ...state,
                loading: false,
                userCourses: action.payload.courses
            };

        case UserCoursesActionTypes.Add: {
            const courses = [...state.userCourses];
            courses.push(action.payload.course);
            return {
                ...state,
                loading: false,
                userCourses: courses
            };

        }

        case UserCoursesActionTypes.Remove: {
            const courses = [...state.userCourses];
            const index = courses.findIndex(c => {
                return c === action.payload.course;
            });
            if (index !== -1) {
                courses.splice(index, 1);
            }

            return {
                ...state,
                loading: false,
                userCourses: courses
            };
        }
        default:
            return {
                loading: false,
                userCourses: []
            };
    }
}