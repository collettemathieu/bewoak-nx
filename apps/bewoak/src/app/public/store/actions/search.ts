import { Action } from '@ngrx/store';
import { Course } from '../../../shared/models/course';

export enum SearchActionTypes {
  Search = '[Courses] search',
  SearchSuccess = '[Courses] search success',
}

export class SearchAction implements Action {
  readonly type = SearchActionTypes.Search;

  constructor(public payload: { searchQuery: string }) {}
}

export class SearchSuccessAction implements Action {
  readonly type = SearchActionTypes.SearchSuccess;

  constructor(public payload: { searchResults: Course[] }) {}
}

export type SearchActions = SearchAction | SearchSuccessAction;
