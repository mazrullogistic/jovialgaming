"use client";
import { decodeData, encodeData } from "./jwt";

export const setRoomID = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getRoomId = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setChatUserData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getChatUserData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};

export const setModelChatData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getModelChatData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};

export const setDisputeData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getDisputeData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setConsoleData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getConsoleData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setTournamentId = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getTournamentId = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setRoomData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getRoomData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setCreate = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {}
  }
};

export const getCreate = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};

export const saveData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setIsMobile = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getIsMobile = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setMatchId = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getMatchId = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setPaymentData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getPaymentData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};

export const setMatchStorageData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getMatchStorageData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setCurrentTourDetailsData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getCurrentTourDetailsData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const setCurrentTourRoundDetailsData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getCurrentTourRoundDetailsData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};
export const saveSignUpData = (key, value) => {
  // console.log("value", key);

  if (typeof window !== "undefined") {
    try {
      const encryptedData = encodeData(value);

      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const getDataSignUpData = (key) => {
  if (typeof window !== "undefined") {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return "";
    }
  }
};

export const removeData = (key) => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {}
  }
};

export const updateData = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      removeData(key);
      saveData(key, value);
    } catch (error) {}
  }
};

export const removeAll = () => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.clear();
    } catch (error) {}
  }
};

export const getSubscribeInfo = () => {

  const user = getData('user');
  return user?.isSubscribe == 1;
}