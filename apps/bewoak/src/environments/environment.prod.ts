// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAnVCv6mLx-G5VVXy04AuEpdcYnkyUdXZs',
    authDomain: '',
    databaseURL: '',
    projectId: 'my-bewoak',
    storageBucket: '',
    messagingSenderId: '',
    auth: {
      baseUrl: 'https://identitytoolkit.googleapis.com/v1/',
    },
  },
  firestore: {
    baseUrlDocument:
      'https://firestore.googleapis.com/v1/projects/my-bewoak/databases/(default)/documents/',
  },
  apiCrossRef: {
    pid: 'collettemathieu@noolib.com',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
