package com.dubaiaccommodations.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dubaiaccommodations.data.model.Conversation
import com.dubaiaccommodations.data.model.Message
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MessagesScreen(
    onNavigateBack: () -> Unit,
    onNavigateToChat: (String) -> Unit
) {
    var conversations by remember { mutableStateOf<List<Conversation>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    // Mock data for demonstration
    LaunchedEffect(Unit) {
        // Simulate API call
        kotlinx.coroutines.delay(1000)
        conversations = listOf(
            Conversation(
                userId = "1",
                user = com.dubaiaccommodations.data.model.User(
                    _id = "1",
                    name = "Ahmed Al Mansouri",
                    email = "ahmed@example.com"
                ),
                lastMessage = Message(
                    content = "Hi, I'm interested in your property in Dubai Marina",
                    createdAt = Date()
                ),
                unreadCount = 2
            ),
            Conversation(
                userId = "2",
                user = com.dubaiaccommodations.data.model.User(
                    _id = "2",
                    name = "Sarah Johnson",
                    email = "sarah@example.com"
                ),
                lastMessage = Message(
                    content = "When can I schedule a viewing?",
                    createdAt = Date(System.currentTimeMillis() - 3600000)
                ),
                unreadCount = 0
            ),
            Conversation(
                userId = "3",
                user = com.dubaiaccommodations.data.model.User(
                    _id = "3",
                    name = "Mohammed Ali",
                    email = "mohammed@example.com"
                ),
                lastMessage = Message(
                    content = "The property is still available",
                    createdAt = Date(System.currentTimeMillis() - 7200000)
                ),
                unreadCount = 1
            )
        )
        loading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Messages") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (loading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                if (conversations.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "No conversations yet",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                } else {
                    items(conversations) { conversation ->
                        ConversationItem(
                            conversation = conversation,
                            onClick = { onNavigateToChat(conversation.userId) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ConversationItem(
    conversation: Conversation,
    onClick: () -> Unit
) {
    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar placeholder
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(MaterialTheme.colorScheme.primary),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = conversation.user.name.take(1).uppercase(),
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = conversation.user.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    
                    Text(
                        text = timeFormat.format(conversation.lastMessage.createdAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = conversation.lastMessage.content,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    
                    if (conversation.unreadCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(20.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = conversation.unreadCount.toString(),
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    otherUserId: String,
    otherUserName: String,
    onNavigateBack: () -> Unit
) {
    var messages by remember { mutableStateOf<List<Message>>(emptyList()) }
    var newMessage by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(true) }
    val listState = rememberLazyListState()

    // Mock data for demonstration
    LaunchedEffect(otherUserId) {
        kotlinx.coroutines.delay(1000)
        messages = listOf(
            Message(
                _id = "1",
                sender = com.dubaiaccommodations.data.model.User(_id = otherUserId, name = otherUserName),
                recipient = com.dubaiaccommodations.data.model.User(_id = "current", name = "You"),
                content = "Hi, I'm interested in your property in Dubai Marina",
                createdAt = Date(System.currentTimeMillis() - 3600000)
            ),
            Message(
                _id = "2",
                sender = com.dubaiaccommodations.data.model.User(_id = "current", name = "You"),
                recipient = com.dubaiaccommodations.data.model.User(_id = otherUserId, name = otherUserName),
                content = "Hello! Yes, it's still available. When would you like to view it?",
                createdAt = Date(System.currentTimeMillis() - 1800000)
            ),
            Message(
                _id = "3",
                sender = com.dubaiaccommodations.data.model.User(_id = otherUserId, name = otherUserName),
                recipient = com.dubaiaccommodations.data.model.User(_id = "current", name = "You"),
                content = "Can we schedule for tomorrow afternoon?",
                createdAt = Date(System.currentTimeMillis() - 900000)
            )
        )
        loading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(otherUserName) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        bottomBar = {
            ChatInput(
                value = newMessage,
                onValueChange = { newMessage = it },
                onSendClick = {
                    if (newMessage.isNotBlank()) {
                        // Add new message to the list
                        val newMsg = Message(
                            _id = (messages.size + 1).toString(),
                            sender = com.dubaiaccommodations.data.model.User(_id = "current", name = "You"),
                            recipient = com.dubaiaccommodations.data.model.User(_id = otherUserId, name = otherUserName),
                            content = newMessage,
                            createdAt = Date()
                        )
                        messages = messages + newMsg
                        newMessage = ""
                    }
                }
            )
        }
    ) { paddingValues ->
        if (loading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                state = listState,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(messages) { message ->
                    MessageBubble(
                        message = message,
                        isFromCurrentUser = message.sender._id == "current"
                    )
                }
            }
        }
    }
}

@Composable
fun MessageBubble(
    message: Message,
    isFromCurrentUser: Boolean
) {
    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }
    
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isFromCurrentUser) Alignment.End else Alignment.Start
    ) {
        Card(
            modifier = Modifier.widthIn(max = 280.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (isFromCurrentUser) 
                    MaterialTheme.colorScheme.primary 
                else 
                    MaterialTheme.colorScheme.surfaceVariant
            )
        ) {
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                Text(
                    text = message.content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (isFromCurrentUser) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = timeFormat.format(message.createdAt),
                    style = MaterialTheme.typography.labelSmall,
                    color = if (isFromCurrentUser) Color.White.copy(alpha = 0.7f) else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                )
            }
        }
    }
}

@Composable
fun ChatInput(
    value: String,
    onValueChange: (String) -> Unit,
    onSendClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.weight(1f),
            placeholder = { Text("Type a message...") },
            maxLines = 3
        )
        
        Spacer(modifier = Modifier.width(8.dp))
        
        FloatingActionButton(
            onClick = onSendClick,
            modifier = Modifier.size(48.dp)
        ) {
            Icon(Icons.Default.Send, contentDescription = "Send")
        }
    }
} 