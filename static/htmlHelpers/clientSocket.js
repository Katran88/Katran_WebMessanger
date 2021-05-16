const socket = io();

async function connectToMessenger()
{
    const user_id = await getUserId();

    socket.emit('user-connect', user_id);
}

socket.on('user-connected', (user_id) =>
{
    refreshContactStatus(user_id, 1);
});

socket.on('user-disconnected', (user_id) =>
{
    refreshContactStatus(user_id, 0);
});

socket.on('receive-message', (messageInfo) =>
{
    if(selectedChatNode && selectedChatNode.id == messageInfo.chat_id)
    {
        addMessageToChatPanelHTML(messageInfo);
    }

    refreshUnreadMessagesAmount(messageInfo.chat_id);
});

socket.on('receive-read-message', (chat_id, message_id) =>
{
    if(selectedChatNode && selectedChatNode.id == chat_id)
    {
        setMessageStatus_Reaction(message_id, 2);
    }

    refreshUnreadMessagesAmount(chat_id);
});

socket.on('receive-new-contact', (contactInfoForOtherContact) =>
{
    addContactToHTML(contactInfoForOtherContact, contactTabSearchInput.value == '');
});

socket.on('receive-delete-contact', (chat_id) =>
{
    deleteChatHTMLbyId(chat_id);

    if(selectedChatNode && selectedChatNode.id == chat_id)
    {
        resetChatSelection();
    }

});

socket.on('receive-new-conv', (chat_id, chat_title, chat_avatar_path, members_amount) =>
{
    addConvToHTML({
        chat_id: chat_id,
        chat_kind: 1,
        chat_title: chat_title,
        chat_avatar_path: chat_avatar_path,
        members_amount: members_amount,
        unread_messages_amount: 0
    }, contactTabSearchInput.value == '');
});

socket.on('user_left_conv', (chat_id, members_amount) =>
{
    refreshChatMembersAmount(chat_id, members_amount);
});

connectToMessenger();