package com.dubaiaccommodations

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dubaiaccommodations.ui.screens.DashboardScreen
import com.dubaiaccommodations.ui.screens.OnboardingScreen
import com.dubaiaccommodations.ui.screens.PropertiesScreen
import com.dubaiaccommodations.ui.theme.DubaiAccommodationsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DubaiAccommodationsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DubaiAccommodationsApp()
                }
            }
        }
    }
}

@Composable
fun DubaiAccommodationsApp() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "onboarding") {
        composable("onboarding") {
            OnboardingScreen(
                onNavigateToDashboard = {
                    navController.navigate("dashboard") {
                        popUpTo("onboarding") { inclusive = true }
                    }
                }
            )
        }
        
        composable("dashboard") {
            DashboardScreen(
                onNavigateToProperties = { navController.navigate("properties") },
                onNavigateToOnboarding = {
                    navController.navigate("onboarding") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                }
            )
        }
        
        composable("properties") {
            PropertiesScreen(
                onNavigateToDashboard = { navController.navigateUp() }
            )
        }
    }
} 