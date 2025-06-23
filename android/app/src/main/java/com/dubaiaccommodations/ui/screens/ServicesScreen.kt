package com.dubaiaccommodations.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
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
import com.dubaiaccommodations.data.model.ServiceProvider
import com.dubaiaccommodations.data.model.Service
import com.dubaiaccommodations.data.model.Rating
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServicesScreen(
    onNavigateBack: () -> Unit,
    onNavigateToProvider: (String) -> Unit
) {
    var providers by remember { mutableStateOf<List<ServiceProvider>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var searchQuery by remember { mutableStateOf("") }

    // Mock data for demonstration
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(1000)
        providers = listOf(
            ServiceProvider(
                _id = "1",
                businessName = "QuickFix Plumbing",
                businessDescription = "Expert plumbing services for homes and offices.",
                phone = "+971 50 123 4567",
                email = "info@quickfix.com",
                serviceAreas = listOf("Dubai Marina", "Downtown Dubai"),
                services = listOf(
                    Service(category = "Plumbing", description = "Leak repair, pipe installation", priceRange = com.dubaiaccommodations.data.model.PriceRange(100.0, 500.0, "AED")),
                    Service(category = "HVAC", description = "AC maintenance", priceRange = com.dubaiaccommodations.data.model.PriceRange(200.0, 800.0, "AED"))
                ),
                businessType = "Company",
                licenseNumber = "LIC123456",
                emergencyService = true,
                rating = Rating(average = 4.7, count = 23),
                isVerified = true
            ),
            ServiceProvider(
                _id = "2",
                businessName = "Sparkle Cleaners",
                businessDescription = "Professional cleaning services for apartments and villas.",
                phone = "+971 55 987 6543",
                email = "contact@sparklecleaners.com",
                serviceAreas = listOf("JBR", "Palm Jumeirah"),
                services = listOf(
                    Service(category = "Cleaning", description = "Deep cleaning, move-in/out cleaning", priceRange = com.dubaiaccommodations.data.model.PriceRange(150.0, 600.0, "AED"))
                ),
                businessType = "Freelancer",
                licenseNumber = "LIC654321",
                emergencyService = false,
                rating = Rating(average = 4.2, count = 12),
                isVerified = false
            )
        )
        loading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Home Services & Maintenance") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                placeholder = { Text("Search by business name or area...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true
            )

            if (loading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else {
                val filteredProviders = providers.filter {
                    it.businessName.contains(searchQuery, ignoreCase = true) ||
                    it.businessDescription.contains(searchQuery, ignoreCase = true) ||
                    it.serviceAreas.any { area -> area.contains(searchQuery, ignoreCase = true) }
                }
                if (filteredProviders.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No service providers found.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(filteredProviders) { provider ->
                            ServiceProviderCard(
                                provider = provider,
                                onClick = { onNavigateToProvider(provider._id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ServiceProviderCard(
    provider: ServiceProvider,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = provider.businessName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                if (provider.isVerified) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Verified",
                        color = Color(0xFF2563EB),
                        fontSize = 12.sp,
                        modifier = Modifier
                            .background(Color(0xFFD1E9FF), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }
            Text(
                text = provider.businessDescription,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Areas: ${provider.serviceAreas.joinToString()}" ,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "${provider.rating.average}  a0",
                    color = Color(0xFFF59E42),
                    fontWeight = FontWeight.Bold
                )
                repeat(5) { i ->
                    Text(
                        text = if (i < provider.rating.average.toInt()) "★" else "☆",
                        color = Color(0xFFF59E42),
                        fontSize = 14.sp
                    )
                }
                Text(
                    text = " (${provider.rating.count} reviews)",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
} 