import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { UserService } from '../../core/services/user/user.service';
import {
  CurrentUserActionTypes,
  UpdateCurrentUserAction,
} from '../actions/user';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User } from '../../shared/models/user';
import { throwError } from 'rxjs';

@Injectable()
export class CurrentUserEffects {
  constructor(private userService: UserService, private action$: Actions) {}

  @Effect({ dispatch: false })
  update$ = this.action$.pipe(
    ofType(CurrentUserActionTypes.Update),
    map((action: UpdateCurrentUserAction) => action.payload.user),
    switchMap((user: User) => this.userService.update(user)),
    catchError((error) => {
      return throwError(error);
    }),
  );
}
