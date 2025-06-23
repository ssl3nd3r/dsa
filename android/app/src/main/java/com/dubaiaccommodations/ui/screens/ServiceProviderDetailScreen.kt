package com.dubaiaccommodations.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dubaiaccommodations.data.model.ServiceProvider
import com.dubaiaccommodations.data.model.ServiceReview
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceProviderDetailScreen(
    provider: ServiceProvider?,
    reviews: List<ServiceReview> = emptyList(),
    onNavigateBack: () -> Unit,
    onContact: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(provider?.businessName ?: "Service Provider") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (provider == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text("Service provider not found.", color = Color.Red)
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = provider.businessName,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = provider.businessDescription,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 16.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Type: ${provider.businessType}", fontSize = 14.sp)
                        Text("License: ${provider.licenseNumber}", fontSize = 14.sp)
                        Text("Areas: ${provider.serviceAreas.joinToString()}", fontSize = 14.sp)
                        Text("Contact: ${provider.phone} | ${provider.email}", fontSize = 14.sp)
                        if (provider.website != null && provider.website.isNotBlank()) {
                            Text("Website: ${provider.website}", fontSize = 14.sp, color = Color(0xFF2563EB))
                        }
                        if (provider.emergencyService) {
                            Text(
                                text = "Emergency Service Available",
                                color = Color.Red,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                        if (provider.isVerified) {
                            Text(
                                text = "Verified",
                                color = Color(0xFF2563EB),
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                    Button(
                        onClick = { onContact(provider.user._id) },
                        modifier = Modifier.align(Alignment.Top)
                    ) {
                        Icon(Icons.Default.Email, contentDescription = null)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Contact")
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text("Services Offered", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(8.dp))
                provider.services.forEach { service ->
                    Text(
                        text = "${service.category}: ${service.description} (AED ${service.priceRange.min} - ${service.priceRange.max})",
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 4.dp)
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text("Recent Reviews", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(8.dp))
                if (reviews.isEmpty()) {
                    Text("No reviews yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    reviews.forEach { review ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB))
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    repeat(5) { i ->
                                        Text(
                                            text = if (i < review.rating) "★" else "☆",
                                            color = Color(0xFFF59E42),
                                            fontSize = 14.sp
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(review.reviewer.name, fontWeight = FontWeight.SemiBold)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(review.serviceDate), fontSize = 12.sp, color = Color.Gray)
                                }
                                Text(review.title, fontWeight = FontWeight.Bold)
                                Text(review.content)
                            }
                        }
                    }
                }
            }
        }
    }
} 