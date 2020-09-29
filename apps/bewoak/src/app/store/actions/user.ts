import { Action } from '@ngrx/store';
import { User } from '../../shared/models/user';

export enum CurrentUserActionTypes {
  Load = '[User] Load the current user',
  Update = '[User] Update the current user',
  Reset = '[User] Reset the current user',
}

export class LoadCurrentUserAction implements Action {
  readonly type = CurrentUserActionTypes.Load;

  constructor(public payload: { user: User }) {}
}

export class UpdateCurrentUserAction implements Action {
  readonly type = CurrentUserActionTypes.Update;

  constructor(public payload: { user: User }) {}
}

export class ResetCurrentUserAction implements Action {
  readonly type = CurrentUserActionTypes.Reset;
}

export type CurrentUserActions =
  | LoadCurrentUserAction
  | UpdateCurrentUserAction
  | ResetCurrentUserAction;
