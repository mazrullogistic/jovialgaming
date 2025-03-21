export const TOAST_ALERTS = {
  LOGIN_SUCCESS: "Login Successfully",
  REGISTER_SUCCESS: "Registered Successfully",
  RESET_PASSWORD: "Verify Otp",
  VERIFIED_SUCCESSFULLY: "Verified Successfully",
  RESET_SUCCESSFULLY: "Password set Successfully. Please Login.",
  ERROR_MESSAGE: "Something went wrong",
  OPPONENT_NOT_READY:
    "Your opponent has not accepted the match yet please wait a few.",
  OpponentDeclineMatchRequest:
    "Opponent declined Match. Please Search for Another",
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  WARN: "warn",
  INFO: "info",
  ERROR: "error",
};
export const CommonConstant = {
  CurrentGameDetails: null,
  notificationCount: 0,
  selectedMatchIndex: 0,
  FreePlayData: null,
  SelectedMatchData: null,
  userDataForChat: null,
  isPaymentDetail: null,
  isChallenge: false,
  pathName: "",
  isFromHome: false,
  isFromChat: false,
  challengeData: null,
  matchTournamentData: null,
};

export const S3KEY = {
  bucket: "piracyapp",
  region: "us-west-2",
};
export const SocketKEY = {
  socketConnect: null,
  socketConnect: null,

  baseURL: "https://admin.jovialgaming.com/api/v1",
  // baseURL: "https://staging-new.jovialgaming.com:1337//api/v1",
  socketUrl: "https://admin.jovialgaming.com",
  // socketUrl: "https://staging-new.jovialgaming.com:1337/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeOut: 30000,
};
export const EmitterKey = {
  FoundMatch: "FoundMatch",
  AcceptMatch: "AcceptMatch",
  DeclineMatch: "DeclineMatch",
  TimerStart: "TimerStart",
  ReadySuccess: "ReadySuccess",
  profile: "profile",
  ScoreWaitingTimer: "ScoreWaitingTimer",
  ReadyTimerStop: "ReadyTimerStop",
  AfterSubmit: "AfterSubmit",
  ReloadApp: "ReloadApp",
  RoomGroupchatMessage: "roomGroupchatMessage",
  GroupchatMessage: "GroupchatMessage",
  TmatchChat: "TmatchChat",
  ChatReceive: "ChatReceive",
  TournamentStart: "TournamentStart",
  ShowDialog: "ShowDialog",
  isModelShow: "isModelShow",

  DrawerClick: "DrawerClick",
};
