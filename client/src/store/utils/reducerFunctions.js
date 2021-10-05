import socket from "../../socket";
import { findLastReceivedMessage } from "./findLastReceivedMessage";

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unread: 1
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const newConvo = {...convo};
      newConvo.messages = [...convo.messages, message];
      newConvo.latestMessageText = message.text;
      if (convo.active) {
        newConvo.unread = 0;
      } else {
        newConvo.unread++;
      }
      // if the other person sent it, tell them we read their message
      if (convo.active && convo.otherUser.id === message.senderId) {
        socket.emit("message-read", {
          senderId: message.senderId,
          convoId: convo.id,
          messageId: message.id
        });
      }
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = {...convo};
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};


export const setNewActiveConvo = (state, convoId) => {
  const newState = state.map((convo) => {
    if (convo.id === convoId) {
      if (convo.unread > 0) {
        const message = findLastReceivedMessage(convo, convo.otherUser.id);
        socket.emit("message-read", {
          senderId: message.senderId,
          convoId: convo.id,
          messageId: message.id
        });
      }
      const newConvo = {...convo, active: true, unread: 0};
      return newConvo;
    } else {
      const newConvo = {...convo, active: false};
      return newConvo;
    }
  });
  return newState;
}

export const setNewMessageRead = (state, convoId, messageId) => {
  const newState = state.map((convo) => {
    // check to make sure the new message read comes after the previous id
    if (convo.id === convoId && convo.lastReadId < messageId) {
      const newConvo = {...convo, lastReadId: messageId};
      return newConvo;
    } else {
      return convo;
    }
  });
  return newState;
}