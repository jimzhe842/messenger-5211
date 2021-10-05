export const sortConversations = (conversations) => {
  conversations.sort(({messages: a}, {messages: b}) => {
    a = a[a.length - 1].createdAt;
    b = b[b.length - 1].createdAt;
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });
}