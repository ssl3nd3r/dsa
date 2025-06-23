package com.dubaiaccommodations.data.model

import java.util.Date

data class Message(
    val _id: String = "",
    val sender: User = User(),
    val recipient: User = User(),
    val content: String = "",
    val messageType: String = "text",
    val relatedProperty: Property? = null,
    val isRead: Boolean = false,
    val createdAt: Date = Date(),
    val readAt: Date? = null
)

data class Conversation(
    val userId: String = "",
    val user: User = User(),
    val lastMessage: Message = Message(),
    val unreadCount: Int = 0
)

data class ChatResponse(
    val messages: List<Message> = emptyList(),
    val pagination: Pagination = Pagination(),
    val otherUser: OtherUser = OtherUser()
)

data class Pagination(
    val current: Int = 1,
    val total: Int = 1,
    val hasMore: Boolean = false
)

data class OtherUser(
    val id: String = "",
    val name: String = "",
    val email: String = ""
)

data class ConversationsResponse(
    val conversations: List<Conversation> = emptyList()
)

data class UnreadCountResponse(
    val unreadCount: Int = 0
) 