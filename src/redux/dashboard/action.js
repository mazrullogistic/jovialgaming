import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  AvailableMatchJoin,
  CreateDisputes,
  DisputesList,
  FreeAvailableMatchJoin,
  FreePlayMatchReqUpdate,
  FreePlayMatchResult,
  FreePlaySubmitScore,
  FreePlayUpdateMatchStatus,
  FreePlayUpdateReadyStatus,
  GetAvailableMatches,
  GetBadge,
  GetBadges,
  GetBadgesData,
  GetBadgesList,
  GetChatList,
  GetConsole,
  GetCurrentMatches,
  GetDisputeChat,
  GetEntryAmount,
  GetFreePlayMatchReqCreate,
  GetGameHistory,
  GetGameList,
  GetGameMode,
  GetGameModeCurrentMatch,
  GetGameRemain,
  GetGameWinLoss,
  GetMatchReqCreate,
  GetMatchRule,
  GetMyTournament,
  GetNews,
  GetProfileCard,
  GetRecentEarner,
  GetRoomChatThread,
  GetSearchBadges,
  GetSeasonList,
  GetTournamentList,
  LeaveRoom,
  MatchHistoryList,
  MatchReqUpdate,
  MatchReqUpdateMultiPlayer,
  MatchResult,
  RoomChat,
  SelectRoom,
  SendChat,
  SendDisputeChat,
  SendRoomChat,
  SubmitScore,
  UpdateMatchStatus,
  UpdateReadyStatus,
  UserChatList,
} from "./services";

export const getRoomList = createAsyncThunk(
  "dashboardSlice/getRoomList",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameList(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const selectRoomAction = createAsyncThunk(
  "dashboardSlice/selectRoomAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SelectRoom(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const leaveRoomAction = createAsyncThunk(
  "dashboardSlice/leaveRoomAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await LeaveRoom(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getAvailableMatchesAction = createAsyncThunk(
  "dashboardSlice/getAvailableMatchesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetAvailableMatches(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getCurrentMatchesAction = createAsyncThunk(
  "dashboardSlice/getCurrentMatchesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetCurrentMatches(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMyTournamentAction = createAsyncThunk(
  "dashboardSlice/getMyTournamentAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMyTournament(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTournamentListAction = createAsyncThunk(
  "dashboardSlice/getTournamentListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetTournamentList(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getNewsAction = createAsyncThunk(
  "dashboardSlice/getNewsAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetNews(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgeAction = createAsyncThunk(
  "dashboardSlice/getBadgeAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadge(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getConsoleAction = createAsyncThunk(
  "dashboardSlice/getConsoleAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetConsole(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getRecentEarnerAction = createAsyncThunk(
  "dashboardSlice/getRecentEarnerAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetRecentEarner(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getEntryAmountAction = createAsyncThunk(
  "dashboardSlice/getEntryAmountAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetEntryAmount(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameModeAction = createAsyncThunk(
  "dashboardSlice/getGameModeAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameMode(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameModeCurrentMatchAction = createAsyncThunk(
  "dashboardSlice/getGameModeCurrentMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameModeCurrentMatch(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqCreateAction = createAsyncThunk(
  "dashboardSlice/getMatchReqCreateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMatchReqCreate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqUpdateAction = createAsyncThunk(
  "dashboardSlice/getMatchReqUpdateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchReqUpdate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqUpdateMultiPlayerAction = createAsyncThunk(
  "dashboardSlice/getMatchReqUpdateMultiPlayerAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchReqUpdateMultiPlayer(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchRuleAction = createAsyncThunk(
  "dashboardSlice/getMatchRuleAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMatchRule(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateMatchAction = createAsyncThunk(
  "dashboardSlice/updateMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateMatchStatus(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateReadyStatusAction = createAsyncThunk(
  "dashboardSlice/updateReadyStatusAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateReadyStatus(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const matchResultAction = createAsyncThunk(
  "dashboardSlice/matchResultAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchResult(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const submitScoreAction = createAsyncThunk(
  "dashboardSlice/submitScoreAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SubmitScore(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

/// Free Play
export const getFreePlayMatchReqCreateAction = createAsyncThunk(
  "dashboardSlice/getFreePlayMatchReqCreateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetFreePlayMatchReqCreate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const getFreePlayMatchReqUpdateAction = createAsyncThunk(
  "dashboardSlice/getFreePlayMatchReqUpdateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayMatchReqUpdate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const freePlayUpdateMatchAction = createAsyncThunk(
  "dashboardSlice/freePlayUpdateMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayUpdateMatchStatus(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlayUpdateReadyStatusAction = createAsyncThunk(
  "dashboardSlice/freePlayUpdateReadyStatusAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayUpdateReadyStatus(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlayMatchResultAction = createAsyncThunk(
  "dashboardSlice/freePlayMatchResultAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayMatchResult(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlaySubmitScoreAction = createAsyncThunk(
  "dashboardSlice/freePlaySubmitScoreAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlaySubmitScore(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const availableMatchJoinAction = createAsyncThunk(
  "dashboardSlice/availableMatchJoinAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await AvailableMatchJoin(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freeAvailableMatchJoinAction = createAsyncThunk(
  "dashboardSlice/freeAvailableMatchJoinAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreeAvailableMatchJoin(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const roomChatAction = createAsyncThunk(
  "dashboardSlice/roomChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await RoomChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendChatAction = createAsyncThunk(
  "dashboardSlice/sendChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendChat(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendDisputeChatAction = createAsyncThunk(
  "dashboardSlice/sendDisputeChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendDisputeChat(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const createDisputesAction = createAsyncThunk(
  "dashboardSlice/createDisputesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await CreateDisputes(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameRemainAction = createAsyncThunk(
  "dashboardSlice/getGameRemainAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameRemain(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendRoomChatAction = createAsyncThunk(
  "dashboardSlice/sendRoomChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendRoomChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const disputesListAction = createAsyncThunk(
  "dashboardSlice/disputesListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await DisputesList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const matchHistoryListAction = createAsyncThunk(
  "dashboardSlice/matchHistoryListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchHistoryList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getProfileCardAction = createAsyncThunk(
  "dashboardSlice/getProfileCardAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetProfileCard(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSeasonListAction = createAsyncThunk(
  "dashboardSlice/getSeasonListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSeasonList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameWinLossAction = createAsyncThunk(
  "dashboardSlice/getGameWinLossAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameWinLoss(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesAction = createAsyncThunk(
  "dashboardSlice/getBadgesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadges(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesDataAction = createAsyncThunk(
  "dashboardSlice/getBadgesDataAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadgesData(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSearchBadgesAction = createAsyncThunk(
  "dashboardSlice/getSearchBadgesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSearchBadges(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameHistoryAction = createAsyncThunk(
  "dashboardSlice/getGameHistoryAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameHistory(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesListAction = createAsyncThunk(
  "dashboardSlice/getBadgesListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadgesList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getRoomChatThreadAction = createAsyncThunk(
  "dashboardSlice/getRoomChatThreadAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetRoomChatThread(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const userChatListAction = createAsyncThunk(
  "dashboardSlice/userChatListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UserChatList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getChatListAction = createAsyncThunk(
  "dashboardSlice/getChatListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetChatList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getDisputeChatAction = createAsyncThunk(
  "dashboardSlice/getDisputeChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetDisputeChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
