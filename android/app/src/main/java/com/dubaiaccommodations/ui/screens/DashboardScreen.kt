package com.dubaiaccommodations.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToProperties: () -> Unit,
    onNavigateToOnboarding: () -> Unit,
    onNavigateToMessages: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Dubai Smart Accommodations") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                    label = { Text("Dashboard") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Search, contentDescription = "Properties") },
                    label = { Text("Properties") },
                    selected = selectedTab == 1,
                    onClick = { 
                        selectedTab = 1
                        onNavigateToProperties()
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Chat, contentDescription = "Messages") },
                    label = { Text("Messages") },
                    selected = selectedTab == 2,
                    onClick = { 
                        selectedTab = 2
                        onNavigateToMessages()
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") },
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
        ) {
            when (selectedTab) {
                0 -> DashboardContent(onNavigateToOnboarding)
                1 -> PropertiesContent()
                2 -> MessagesContent()
                3 -> ProfileContent()
            }
        }
    }
}

@Composable
fun DashboardContent(onNavigateToOnboarding: () -> Unit) {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        // Welcome Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Welcome to Dubai Smart Accommodations",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Find your perfect shared accommodation match",
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Quick Actions
        Text(
            text = "Quick Actions",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Card(
                modifier = Modifier.weight(1f),
                onClick = onNavigateToOnboarding
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        Icons.Default.Edit,
                        contentDescription = "Update Profile",
                        modifier = Modifier.size(32.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Update Profile",
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            
            Card(
                modifier = Modifier.weight(1f)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = "Find Properties",
                        modifier = Modifier.size(32.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Find Properties",
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Smart Property Recommendations
        Text(
            text = "Smart Property Recommendations",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        // Mock recommended properties
        val recommendedProperties = remember {
            listOf(
                RecommendedProperty(
                    id = "1",
                    title = "Modern Studio in Downtown",
                    area = "Downtown Dubai",
                    price = "AED 3,500",
                    propertyType = "Studio",
                    matchingScore = 95,
                    amenities = listOf("WiFi", "AC", "Gym", "Pool"),
                    budgetMatch = true,
                    areaMatch = true,
                    amenitiesMatch = true
                ),
                RecommendedProperty(
                    id = "2",
                    title = "Cozy 1BR Apartment",
                    area = "Dubai Marina",
                    price = "AED 4,200",
                    propertyType = "1BR",
                    matchingScore = 87,
                    amenities = listOf("WiFi", "AC", "Parking", "Balcony"),
                    budgetMatch = true,
                    areaMatch = false,
                    amenitiesMatch = true
                ),
                RecommendedProperty(
                    id = "3",
                    title = "Spacious 2BR Villa",
                    area = "Palm Jumeirah",
                    price = "AED 8,500",
                    propertyType = "2BR",
                    matchingScore = 72,
                    amenities = listOf("WiFi", "AC", "Gym", "Pool", "Garden"),
                    budgetMatch = false,
                    areaMatch = true,
                    amenitiesMatch = true
                )
            )
        }
        
        recommendedProperties.forEach { property ->
            RecommendedPropertyCard(property = property)
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecommendedPropertyCard(property: RecommendedProperty) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = { /* Navigate to property details */ }
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = property.title,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = property.area,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${property.price}/month",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = property.propertyType,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
                
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Text(
                        text = "${property.matchingScore}%",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Match reasons
            Text(
                text = "Why this matches you:",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (property.budgetMatch) {
                    Chip(
                        onClick = { },
                        label = { Text("Budget", fontSize = 10.sp) },
                        colors = ChipDefaults.chipColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
                if (property.areaMatch) {
                    Chip(
                        onClick = { },
                        label = { Text("Area", fontSize = 10.sp) },
                        colors = ChipDefaults.chipColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
                if (property.amenitiesMatch) {
                    Chip(
                        onClick = { },
                        label = { Text("Amenities", fontSize = 10.sp) },
                        colors = ChipDefaults.chipColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { /* View details */ },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text("View Details", fontSize = 12.sp)
                }
                Button(
                    onClick = { /* Contact owner */ },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.secondary
                    )
                ) {
                    Text("Contact", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun PropertiesContent() {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = "Properties",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Property listings will appear here",
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )
    }
}

@Composable
fun MessagesContent() {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = "Messages",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Messages content will appear here",
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileContent() {
    var showEditProfile by remember { mutableStateOf(false) }
    
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Profile",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Button(
                onClick = { showEditProfile = !showEditProfile },
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Text(if (showEditProfile) "Cancel" else "Edit Profile")
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        if (!showEditProfile) {
            // Profile Display
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Profile Information",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )
                    
                    ProfileInfoRow("Name", "John Doe")
                    ProfileInfoRow("Email", "john@example.com")
                    ProfileInfoRow("Lifestyle", "Active")
                    ProfileInfoRow("Work Schedule", "9-5")
                    ProfileInfoRow("Languages", "English, Arabic")
                    ProfileInfoRow("Budget", "AED 3,000 - 5,000")
                    ProfileInfoRow("Preferred Areas", "Dubai Marina, Downtown")
                    ProfileInfoRow("Amenities", "WiFi, AC, Gym, Pool")
                    ProfileInfoRow("Lease Duration", "12 months")
                }
            }
        } else {
            // Profile Edit Form
            ProfileEditForm(
                onSave = { showEditProfile = false },
                onCancel = { showEditProfile = false }
            )
        }
    }
}

@Composable
fun ProfileInfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Text(
            text = "$label:",
            fontWeight = FontWeight.Medium,
            modifier = Modifier.width(120.dp)
        )
        Text(
            text = value,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileEditForm(onSave: () -> Unit, onCancel: () -> Unit) {
    var name by remember { mutableStateOf("John Doe") }
    var lifestyle by remember { mutableStateOf("Active") }
    var workSchedule by remember { mutableStateOf("9-5") }
    var budgetMin by remember { mutableStateOf("3000") }
    var budgetMax by remember { mutableStateOf("5000") }
    var preferredAreas by remember { mutableStateOf(setOf("Dubai Marina", "Downtown Dubai")) }
    var amenities by remember { mutableStateOf(setOf("WiFi", "AC", "Gym")) }
    var leaseDuration by remember { mutableStateOf("12") }
    
    val lifestyleOptions = listOf("Quiet", "Active", "Smoker", "Non-smoker", "Pet-friendly", "No pets")
    val workScheduleOptions = listOf("9-5", "Night shift", "Remote", "Flexible", "Student")
    val areaOptions = listOf(
        "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "JBR", "Business Bay",
        "JLT", "DIFC", "Al Barsha", "Jumeirah"
    )
    val amenitiesOptions = listOf(
        "WiFi", "AC", "Heating", "Kitchen", "Washing Machine", "Dryer",
        "Parking", "Gym", "Pool", "Garden", "Balcony", "Terrace",
        "Security", "Concierge", "Cleaning Service", "Furnished"
    )
    
    Column(
        modifier = Modifier.verticalScroll(rememberScrollState())
    ) {
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Edit Profile",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                )
                
                // Lifestyle dropdown
                var lifestyleExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = lifestyleExpanded,
                    onExpandedChange = { lifestyleExpanded = it }
                ) {
                    OutlinedTextField(
                        value = lifestyle,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Lifestyle") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = lifestyleExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                            .padding(bottom = 8.dp)
                    )
                    ExposedDropdownMenu(
                        expanded = lifestyleExpanded,
                        onDismissRequest = { lifestyleExpanded = false }
                    ) {
                        lifestyleOptions.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    lifestyle = option
                                    lifestyleExpanded = false
                                }
                            )
                        }
                    }
                }
                
                // Work Schedule dropdown
                var workScheduleExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = workScheduleExpanded,
                    onExpandedChange = { workScheduleExpanded = it }
                ) {
                    OutlinedTextField(
                        value = workSchedule,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Work Schedule") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = workScheduleExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                            .padding(bottom = 8.dp)
                    )
                    ExposedDropdownMenu(
                        expanded = workScheduleExpanded,
                        onDismissRequest = { workScheduleExpanded = false }
                    ) {
                        workScheduleOptions.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    workSchedule = option
                                    workScheduleExpanded = false
                                }
                            )
                        }
                    }
                }
                
                // Budget
                Text(
                    text = "Budget (AED)",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = budgetMin,
                        onValueChange = { budgetMin = it },
                        label = { Text("Min") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = budgetMax,
                        onValueChange = { budgetMax = it },
                        label = { Text("Max") },
                        modifier = Modifier.weight(1f)
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Preferred Areas
                Text(
                    text = "Preferred Areas",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(areaOptions) { area ->
                        FilterChip(
                            selected = preferredAreas.contains(area),
                            onClick = {
                                preferredAreas = if (preferredAreas.contains(area)) {
                                    preferredAreas - area
                                } else {
                                    preferredAreas + area
                                }
                            },
                            label = { Text(area, fontSize = 12.sp) }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Amenities
                Text(
                    text = "Amenities",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(amenitiesOptions) { amenity ->
                        FilterChip(
                            selected = amenities.contains(amenity),
                            onClick = {
                                amenities = if (amenities.contains(amenity)) {
                                    amenities - amenity
                                } else {
                                    amenities + amenity
                                }
                            },
                            label = { Text(amenity, fontSize = 12.sp) }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                OutlinedTextField(
                    value = leaseDuration,
                    onValueChange = { leaseDuration = it },
                    label = { Text("Lease Duration (months)") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onCancel,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.secondary
                        )
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = onSave,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Text("Save Changes")
                    }
                }
            }
        }
    }
}

data class RecommendedProperty(
    val id: String,
    val title: String,
    val area: String,
    val price: String,
    val propertyType: String,
    val matchingScore: Int,
    val amenities: List<String>,
    val budgetMatch: Boolean,
    val areaMatch: Boolean,
    val amenitiesMatch: Boolean
) 