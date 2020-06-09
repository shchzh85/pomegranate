export enum Code {
  OK = 0,
  BAD_PARAMS = 400,
  UNAUTHORIZATION = 401,
  FORBIDDEN = 403,
  INVALID_HEADERS = 405,
  SERVER_ERROR = 500,

  INVALID_INVITE_CODE = 1001,
  USERNAME_EXIST = 1002,
  USERNAME_NOT_FOUND = 1003,
  INVALID_PASSWORD = 1004,
  USER_LOCKED = 1005,
  USER_NOT_AUTHORIZED = 1006,
  QUEST_NOT_FOUND = 1007,
  QUEST_TIMES_NOT_ENOUGH = 1008,
  BALANCE_NOT_ENOUGH = 1009,
  OPERATION_FORBIDDEN = 1010,
  ORDER_NOT_PAY = 1011,
  ORDER_BUY_EXISTS = 1012,
  INVALID_OPERATION = 1013,
  ORDER_NOT_FOUND = 1014,
  WALLET_NOT_FOUND = 1015,
  USER_LOCK_FAILED = 1016,
  USER_NOT_FOUND = 1017,
  INVALID_SMS_CODE = 1018,
  SMS_FREQUENTLY = 1019,
  REGISTER_CLOSED = 1020,
  INVALID_BUSINESS_ID = 1021,
  INVALID_PAY_NUM = 1022,
};
