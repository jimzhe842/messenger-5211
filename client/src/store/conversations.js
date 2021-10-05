import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  setNewActiveConvo,
  setNewMessageRead
} from "./utils/reducerFunctions";
import { sortConversations } from "./utils/sortConversations";
import { findLastSentMessage } from "./utils/findLastSentMessage";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const SET_ACTIVE_CONVERSATION = "SET_ACTIVE_CONVERSATION";
const SET_MESSAGE_READ = "SET_MESSAGE_READ";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

export const setActiveConversation = (convoId) => {
  return {
    type: SET_ACTIVE_CONVERSATION,
    payload: { convoId }
  }
}

export const setMessageRead = (convoId, messageId) => {
  return {
    type: SET_MESSAGE_READ,
    payload: { convoId, messageId }
  }
}

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      action.conversations.forEach((conversation) => {
        conversation.unread = 0;
        conversation.active = false;

        // for convenience since the server doesn't track read messages, set the lastRead to most recent message
        const otherId = conversation.otherUser.id;
        const lastReadId = (findLastSentMessage(conversation, otherId)).id;

        conversation.lastReadId = lastReadId;
      });
      sortConversations(action.conversations);
      return action.conversations;
    case SET_MESSAGE:
      const newState = addMessageToStore(state, action.payload);
      sortConversations(newState);
      return newState;
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    case SET_ACTIVE_CONVERSATION:
      return setNewActiveConvo(
        state,
        action.payload.convoId
      )
    case SET_MESSAGE_READ:
      return setNewMessageRead(
        state,
        action.payload.convoId,
        action.payload.messageId
      )
    default:
      return state;
  }
};

export default reducer;
