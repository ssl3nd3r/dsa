package com.dubaiaccommodations.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dubaiaccommodations.data.model.OnboardingData
import com.dubaiaccommodations.ui.components.DropdownMenuBox
import com.dubaiaccommodations.ui.components.FilterChip
import com.dubaiaccommodations.ui.components.FlowRow
import com.dubaiaccommodations.viewmodel.OnboardingViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(
    onNavigateToDashboard: () -> Unit,
    viewModel: OnboardingViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val scope = rememberCoroutineScope()

    LaunchedEffect(uiState.isSuccess) {
        if (uiState.isSuccess) {
            onNavigateToDashboard()
        }
    }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFFe0f2fe), Color.White))),
        color = Color.Transparent
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Card(
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(0.95f)
                    .verticalScroll(rememberScrollState()),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text(
                        "Welcome to Dubai Smart Accommodations",
                        fontSize = 26.sp,
                        color = Color(0xFF2563eb),
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    // Basic Information
                    OutlinedTextField(
                        value = uiState.name,
                        onValueChange = { viewModel.updateName(it) },
                        label = { Text("Full Name") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp)
                    )

                    OutlinedTextField(
                        value = uiState.email,
                        onValueChange = { viewModel.updateEmail(it) },
                        label = { Text("Email") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp)
                    )

                    OutlinedTextField(
                        value = uiState.password,
                        onValueChange = { viewModel.updatePassword(it) },
                        label = { Text("Password") },
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp)
                    )

                    // Lifestyle Preferences
                    DropdownMenuBox(
                        label = "Lifestyle",
                        options = listOf("Quiet", "Active", "Smoker", "Non-smoker", "Pet-friendly", "No pets"),
                        selected = uiState.lifestyle,
                        onSelect = { viewModel.updateLifestyle(it) }
                    )

                    Spacer(Modifier.height(8.dp))

                    // Personality Traits
                    Text(
                        "Personality Traits",
                        fontSize = 16.sp,
                        color = Color(0xFF2563eb),
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    FlowRow(
                        mainAxisSpacing = 8.dp,
                        crossAxisSpacing = 8.dp
                    ) {
                        listOf("Introvert", "Extrovert", "Organized", "Flexible", "Social", "Quiet", "Adventurous", "Calm").forEach { trait ->
                            FilterChip(
                                selected = uiState.personalityTraits.contains(trait),
                                onClick = { viewModel.togglePersonalityTrait(trait) },
                                label = { Text(trait) }
                            )
                        }
                    }

                    Spacer(Modifier.height(8.dp))

                    // Work Schedule
                    DropdownMenuBox(
                        label = "Work Schedule",
                        options = listOf("9-5", "Night shift", "Remote", "Flexible", "Student"),
                        selected = uiState.workSchedule,
                        onSelect = { viewModel.updateWorkSchedule(it) }
                    )

                    Spacer(Modifier.height(8.dp))

                    // Languages
                    Text(
                        "Languages",
                        fontSize = 16.sp,
                        color = Color(0xFF2563eb),
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    FlowRow(
                        mainAxisSpacing = 8.dp,
                        crossAxisSpacing = 8.dp
                    ) {
                        listOf("English", "Arabic", "Hindi", "Urdu", "Tagalog", "Other").forEach { lang ->
                            FilterChip(
                                selected = uiState.languages.contains(lang),
                                onClick = { viewModel.toggleLanguage(lang) },
                                label = { Text(lang) }
                            )
                        }
                    }

                    // Cultural Preferences
                    OutlinedTextField(
                        value = uiState.dietary,
                        onValueChange = { viewModel.updateDietary(it) },
                        label = { Text("Dietary Preference") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp)
                    )

                    OutlinedTextField(
                        value = uiState.religion,
                        onValueChange = { viewModel.updateReligion(it) },
                        label = { Text("Religion") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp)
                    )

                    // Error and Success Messages
                    if (uiState.error.isNotEmpty()) {
                        Text(
                            uiState.error,
                            color = Color.Red,
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                    }

                    if (uiState.isSuccess) {
                        Text(
                            "Profile created successfully!",
                            color = Color(0xFF059669),
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                    }

                    // Submit Button
                    Button(
                        onClick = { viewModel.submitOnboarding() },
                        enabled = !uiState.isLoading && uiState.isFormValid,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                    ) {
                        Text(
                            if (uiState.isLoading) "Creating Profile..." else "Create Profile"
                        )
                    }
                }
            }
        }
    }
} 