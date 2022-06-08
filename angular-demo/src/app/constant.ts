// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const constant = {
  LOGIN: 'user/login',
  RESET_TOKEN: 'user/resetToken',
  FORGOTPASSWORD: 'user/forgotPassword',
  RESETPASSWORD: 'user/resetPassword',
  RESETTOKENVALIDATE: 'user/resetRequestValidate',
  GET_USER_DETAIL: 'user/details',
  CHANGE_PASSWORD: 'user/changePassword',
  GET_MENU_DATA: 'user/menu',
  RESET_USER_PASSWORD: 'user/resetUserPassword',

  GET_USERS: 'user/findAll',
  DELETE_USERS: 'user',
  SAVE_USERS: 'user',
  UPDATE_ASSIGNED_ROLES: 'user/updateAssignedRoles',
  UPDATE_USERS_STATUS: 'user/updateStatus',
  GET_CLASS_USERS: 'user/getClassUsers',

};
