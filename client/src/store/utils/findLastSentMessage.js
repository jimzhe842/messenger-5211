// returns the id of the last sent message

export const findLastSentMessage = (conversation, otherId) => {
  let lastSentMessage = {id: -1};
  for (let i = conversation.messages.length - 1; i >= 0; i--) {
    let message = conversation.messages[i];
    if (message.senderId !== otherId) {
      lastSentMessage = message;
      break;
    }
  }
  return lastSentMessage;
}
