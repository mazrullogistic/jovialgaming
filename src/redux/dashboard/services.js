import { API_ROUTER } from "@/services/apiRouter";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "@/services/axiosHelper";

export const GetUser = (data) => {
  return axiosGet(API_ROUTER.GET_USER, data);
};

export const GetGameList = (data) => {
  return axiosGet(API_ROUTER.GAME_LIST, data);
};

export const SelectRoom = (data) => {
  return axiosPost(API_ROUTER.SELECT_ROOM, data);
};
export const LeaveRoom = (data) => {
  return axiosPost(API_ROUTER.LEAVE_ROOM, data);
};
export const GetAvailableMatches = (data) => {
  return axiosGet(API_ROUTER.GET_AVAILABLE_MATCHES, data);
};
export const GetCurrentMatches = (data) => {
  return axiosGet(API_ROUTER.GET_CURRENT_MATCHES, data);
};
export const GetMyTournament = (data) => {
  return axiosPost(API_ROUTER.GET_MY_TOURNAMENT, data);
};
export const GetTournamentList = (data) => {
  return axiosGet(API_ROUTER.GET_TOURNAMENT_LIST, data);
};
export const GetNews = (data) => {
  return axiosGet(API_ROUTER.GET_NEWS, data);
};
export const GetBadge = (data) => {
  return axiosGet(API_ROUTER.GET_BADGE, data);
};
export const GetConsole = (data) => {
  return axiosGet(API_ROUTER.GET_CONSOLE, data);
};
export const GetRecentEarner = (data) => {
  return axiosGet(API_ROUTER.RECENT_EARNERS, data);
};
export const GetEntryAmount = (data) => {
  return axiosGet(API_ROUTER.ENTRY_AMOUNT, data);
};
export const GetGameMode = (data) => {
  return axiosGet(API_ROUTER.GAME_MODE, data);
};
export const GetGameModeCurrentMatch = (data) => {
  return axiosGet(API_ROUTER.GAME_MODE_CURRENT_MATCH, data);
};
export const GetMatchReqCreate = (data) => {
  return axiosPost(API_ROUTER.MATCH_REQUEST_CREATE, data);
};
export const MatchReqUpdate = (data) => {
  return axiosPost(API_ROUTER.MATCH_REQUEST_UPDATE, data);
};
export const MatchReqUpdateMultiPlayer = (data) => {
  return axiosPost(API_ROUTER.MATCH_REQUEST_UPDATE_MULTIPLAYER, data);
};
export const GetMatchRule = (data) => {
  return axiosGet(API_ROUTER.GAME_RULE + data, null);
};
export const UpdateMatchStatus = (data) => {
  return axiosPost(API_ROUTER.UPDATE_MATCH_STATUS, data);
};
export const UpdateReadyStatus = (data) => {
  return axiosPost(API_ROUTER.UPDATE_READY_STATUS, data);
};
export const TournamentRegister = (data) => {
  return axiosPost(API_ROUTER.TOURNAMENT_REGISTER, data);
};
export const UpdateReadyTournamentStatus = (data) => {
  return axiosPost(API_ROUTER.UPDATE_READY_TOURNAMENT_STATUS, data);
};
export const TournamentSubmitScore = (data) => {
  return axiosPost(API_ROUTER.TOURNAMENT_SUBMIT_SCORE, data);
};
export const TournamentMatchResult = (data) => {
  return axiosPost(API_ROUTER.TOURNAMENT_MATCH_RESULT, data);
};
export const MatchResult = (data) => {
  return axiosPost(API_ROUTER.MATCH_RESULT, data);
};
export const SubmitScore = (data) => {
  return axiosPost(API_ROUTER.SUBMIT_SCORE, data);
};
export const AvailableMatchJoin = (data) => {
  return axiosPost(API_ROUTER.AVAILABLE_MATCH_JOIN, data);
};
export const FreeAvailableMatchJoin = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_AVAILABLE_MATCH_JOIN, data);
};

///////
export const GetFreePlayMatchReqCreate = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_MATCH_REQUEST_CREATE, data);
};
export const FreePlayMatchReqUpdate = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_MATCH_REQUEST_UPDATE, data);
};
export const FreePlayUpdateMatchStatus = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_UPDATE_MATCH_STATUS, data);
};
export const FreePlayUpdateReadyStatus = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_UPDATE_READY_STATUS, data);
};
export const FreePlayMatchResult = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_MATCH_RESULT, data);
};
export const FreePlaySubmitScore = (data) => {
  return axiosPost(API_ROUTER.FREE_PLAY_SUBMIT_SCORE, data);
};
export const getRegisterUserList = (data) => {
  return axiosPost(API_ROUTER.REGISTER_USER_LIST, data);
};
export const SendRoomChat = (data) => {
  return axiosPost(API_ROUTER.SEND_ROOM_CHAT, data, "multipart/form-data");
};
export const UpdateStartMatch = (data) => {
  return axiosPost(API_ROUTER.UPDATE_START_MATCH, data, "multipart/form-data");
};
export const SendChat = (data) => {
  return axiosPost(API_ROUTER.SEND_CHAT, data, "multipart/form-data");
};
export const SendDisputeChat = (data) => {
  return axiosPost(API_ROUTER.SEND_DISPUTE_CHAT, data, "multipart/form-data");
};
export const CreateDisputes = (data) => {
  return axiosPost(API_ROUTER.CREATE_DISPUTES, data, "multipart/form-data");
};
export const RoomChat = (data) => {
  return axiosGet(API_ROUTER.ROOM_CHAT, data);
};
export const getCurrentTournamentMatch = (data) => {
  return axiosGet(API_ROUTER.GET_CURRENT_TOURNAMENT_MATCH, data);
};
export const GetProfileCard = (data) => {
  return axiosGet(API_ROUTER.GET_PROFILE_CARD, data);
};
export const GetSeasonList = (data) => {
  return axiosGet(API_ROUTER.GET_SEASON_LIST, data);
};
export const DisputesList = (data) => {
  return axiosGet(API_ROUTER.DISPUTES_LIST, data);
};
export const MatchHistoryList = (data) => {
  return axiosPost(API_ROUTER.MATCH_HISTORY, data);
};
export const UpdateProfile = (data) => {
  return axiosPost(API_ROUTER.UPDATE_PROFILE, data);
};
export const WithdrawAmount = (data) => {
  return axiosPost(API_ROUTER.WITHDRAW_AMOUNT, data);
};
export const UserChatList = (data) => {
  return axiosPost(API_ROUTER.USER_CHAT_LIST, data);
};
export const GetGameWinLoss = (data) => {
  return axiosGet(API_ROUTER.GET_GAME_WIN_LOSS, data);
};
export const GetSubscriptionDetail = (data) => {
  return axiosGet(API_ROUTER.GET_SUBSCRIPTION_DETAIL, data);
};
export const GetPlanDetail = (data) => {
  return axiosGet(API_ROUTER.PAYPAL_PLAN_DETAIL, data);
};
export const GetBadges = (data) => {
  return axiosGet(API_ROUTER.GET_BADGES, data);
};
export const GetGameByConsole = (data) => {
  return axiosGet(API_ROUTER.GAME_BY_CONSOLE + data, null);
};
export const GetTournamentRules = (data) => {
  return axiosGet(API_ROUTER.TOURNAMENT_RULES + data, null);
};
export const GetProfileData = (data) => {
  return axiosGet(API_ROUTER.GET_PROFILE + data, null);
};
export const GetBadgesData = (data) => {
  return axiosPost(API_ROUTER.GET_BADGES, data);
};
export const DeleteMatch = (data) => {
  return axiosPost(API_ROUTER.DELETE_MATCH, data);
};
export const FPDeleteMatch = (data) => {
  return axiosPost(API_ROUTER.FP_DELETE_MATCH, data);
};
export const AddSubscriptionData = (data) => {
  return axiosPost(API_ROUTER.PAYPAL_SUBSCRIPTION_ADD, data);
};
export const GetSearchBadges = (data) => {
  return axiosPost(API_ROUTER.USER_SEARCH_BADGE, data);
};
export const AddDeviceToken = (data) => {
  return axiosPost(API_ROUTER.ADD_DEVICE_TOKEN, data);
};
export const GetBadgeUserList = (data) => {
  return axiosPost(API_ROUTER.GET_BADGE_USER_LIST, data);
};
export const GetUserPoints = (data) => {
  return axiosPost(API_ROUTER.GET_USER_POINT, data);
};
export const TestNotification = (data) => {
  return axiosPost(API_ROUTER.TEST_NOTIFICATION, data);
};
export const GetBadgesList = (data) => {
  return axiosGet(API_ROUTER.GET_BADGE_LIST, data);
};
export const GetTop5Users = (data) => {
  return axiosGet(API_ROUTER.TOP_5_USER, data);
};
export const GetNotificationList = (data) => {
  return axiosGet(API_ROUTER.NOTIFICATION_LIST, data);
};
export const GetGameHistory = (data) => {
  return axiosGet(API_ROUTER.GET_GAME_HISTORY, data);
};
export const GetRoomChatThread = (data) => {
  return axiosGet(API_ROUTER.ROOM_CHAT_THREAD, data);
};
export const GetGameRemain = (data) => {
  return axiosGet(API_ROUTER.GET_GAME_REMAIN, data);
};
export const GetPaypalPlanList = (data) => {
  return axiosGet(API_ROUTER.PAYPAL_PLAN_LIST, data);
};
export const GetChatList = (data) => {
  return axiosPost(API_ROUTER.CHAT_LIST, data);
};
export const GetCardPurchase = (data) => {
  return axiosPost(API_ROUTER.CARD_PURCHASE, data);
};
export const GetDisputeChat = (data) => {
  return axiosPost(API_ROUTER.GET_DISPUTE_CHAT, data);
};
export const PaidPlayChallenge = (data) => {
  return axiosPost(API_ROUTER.challengeFriendApi, data);
};
export const FreePlayChallenge = (data) => {
  return axiosPost(API_ROUTER.FpchallengeFriendApi, data);
};

export const GetSearchUser = (data) => {
  return axiosPost(API_ROUTER.GET_USER_SEARCH, data);
};
export const GetChallengeFriend = (data) => {
  return axiosPost(API_ROUTER.Challenge_Friend, data);
};
export const GetFpChallengeFriend = (data) => {
  return axiosPost(API_ROUTER.Fp_Challenge_Friend, data);
};
