// returns the id of the last received message

export const findLastReceivedMessage = (conversation, otherId) => {
  let lastReceivedMessage = {id: -1};
  for (let i = conversation.messages.length - 1; i >= 0; i--) {
    let message = conversation.messages[i];
    if (message.senderId === otherId) {
      lastReceivedMessage = message;
      break;
    }
  }
  return lastReceivedMessage;
}
