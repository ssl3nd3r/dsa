import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class OnboardingForm : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            OnboardingScreen()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen() {
    val personalityOptions = listOf("Introvert", "Extrovert", "Organized", "Flexible", "Social", "Quiet", "Adventurous", "Calm")
    val lifestyleOptions = listOf("Quiet", "Active", "Smoker", "Non-smoker", "Pet-friendly", "No pets")
    val workScheduleOptions = listOf("9-5", "Night shift", "Remote", "Flexible", "Student")
    val languageOptions = listOf("English", "Arabic", "Hindi", "Urdu", "Tagalog", "Other")
    val areaOptions = listOf(
        "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "JBR", "Business Bay",
        "Dubai Hills Estate", "Arabian Ranches", "Emirates Hills", "Meadows",
        "Springs", "Lakes", "JLT", "DIFC", "Sheikh Zayed Road", "Al Barsha",
        "Jumeirah", "Umm Suqeim", "Al Sufouh", "Al Quoz", "Al Khail", "Other"
    )
    val amenitiesOptions = listOf(
        "WiFi", "AC", "Heating", "Kitchen", "Washing Machine", "Dryer",
        "Parking", "Gym", "Pool", "Garden", "Balcony", "Terrace",
        "Security", "Concierge", "Cleaning Service", "Furnished",
        "Pet Friendly", "Smoking Allowed", "Wheelchair Accessible"
    )
    val billingCycleOptions = listOf("Monthly", "Quarterly", "Yearly")

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var lifestyle by remember { mutableStateOf("") }
    var personalityTraits by remember { mutableStateOf(setOf<String>()) }
    var workSchedule by remember { mutableStateOf("") }
    var languages by remember { mutableStateOf(setOf<String>()) }
    var dietary by remember { mutableStateOf("") }
    var religion by remember { mutableStateOf("") }
    var budgetMin by remember { mutableStateOf("") }
    var budgetMax by remember { mutableStateOf("") }
    var preferredAreas by remember { mutableStateOf(setOf<String>()) }
    var amenities by remember { mutableStateOf(setOf<String>()) }
    var moveInDate by remember { mutableStateOf("") }
    var leaseDuration by remember { mutableStateOf("") }
    var billingCycle by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var success by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    fun submit() {
        loading = true
        error = ""
        val client = OkHttpClient()
        val json = JSONObject().apply {
            put("name", name)
            put("email", email)
            put("password", password)
            put("lifestyle", lifestyle)
            put("personalityTraits", personalityTraits.toList())
            put("workSchedule", workSchedule)
            put("culturalPreferences", JSONObject().apply {
                put("languages", languages.toList())
                put("dietary", dietary)
                put("religion", religion)
            })
            put("budget", JSONObject().apply {
                put("min", budgetMin)
                put("max", budgetMax)
            })
            put("preferredAreas", preferredAreas.toList())
            put("amenities", amenities.toList())
            put("moveInDate", moveInDate)
            put("leaseDuration", leaseDuration)
            put("billingCycle", billingCycle)
        }
        val body = RequestBody.create(MediaType.parse("application/json"), json.toString())
        val request = Request.Builder()
            .url("http://10.0.2.2:5000/api/user/preferences")
            .post(body)
            .build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                loading = false
                error = "Submission failed. Please try again."
            }
            override fun onResponse(call: Call, response: Response) {
                loading = false
                if (response.isSuccessful) {
                    success = true
                } else {
                    error = "Submission failed. Please try again."
                }
            }
        })
    }

    Surface(
        modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color(0xFFe0f2fe), Color.White))),
        color = Color.Transparent
    ) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Card(
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.padding(16.dp).fillMaxWidth(0.95f),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text("Onboarding", fontSize = 26.sp, color = Color(0xFF2563eb), modifier = Modifier.padding(bottom = 16.dp))
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Password") }, visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    DropdownMenuBox(label = "Lifestyle", options = lifestyleOptions, selected = lifestyle, onSelect = { lifestyle = it })
                    Spacer(Modifier.height(8.dp))
                    Text("Personality Traits", fontSize = 16.sp, color = Color(0xFF2563eb))
                    FlowRow(mainAxisSpacing = 8.dp, crossAxisSpacing = 8.dp) {
                        personalityOptions.forEach { trait ->
                            FilterChip(
                                selected = personalityTraits.contains(trait),
                                onClick = {
                                    personalityTraits = if (personalityTraits.contains(trait)) personalityTraits - trait else personalityTraits + trait
                                },
                                label = { Text(trait) }
                            )
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    DropdownMenuBox(label = "Work Schedule", options = workScheduleOptions, selected = workSchedule, onSelect = { workSchedule = it })
                    Spacer(Modifier.height(8.dp))
                    Text("Languages", fontSize = 16.sp, color = Color(0xFF2563eb))
                    FlowRow(mainAxisSpacing = 8.dp, crossAxisSpacing = 8.dp) {
                        languageOptions.forEach { lang ->
                            FilterChip(
                                selected = languages.contains(lang),
                                onClick = {
                                    languages = if (languages.contains(lang)) languages - lang else languages + lang
                                },
                                label = { Text(lang) }
                            )
                        }
                    }
                    OutlinedTextField(value = dietary, onValueChange = { dietary = it }, label = { Text("Dietary Preference") }, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp))
                    OutlinedTextField(value = religion, onValueChange = { religion = it }, label = { Text("Religion") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    OutlinedTextField(value = budgetMin, onValueChange = { budgetMin = it }, label = { Text("Budget Min (AED)") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    OutlinedTextField(value = budgetMax, onValueChange = { budgetMax = it }, label = { Text("Budget Max (AED)") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    Text("Preferred Locations", fontSize = 16.sp, color = Color(0xFF2563eb))
                    FlowRow(mainAxisSpacing = 8.dp, crossAxisSpacing = 8.dp) {
                        areaOptions.forEach { area ->
                            FilterChip(
                                selected = preferredAreas.contains(area),
                                onClick = {
                                    preferredAreas = if (preferredAreas.contains(area)) preferredAreas - area else preferredAreas + area
                                },
                                label = { Text(area) }
                            )
                        }
                    }
                    Text("Amenities", fontSize = 16.sp, color = Color(0xFF2563eb))
                    FlowRow(mainAxisSpacing = 8.dp, crossAxisSpacing = 8.dp) {
                        amenitiesOptions.forEach { amenity ->
                            FilterChip(
                                selected = amenities.contains(amenity),
                                onClick = {
                                    amenities = if (amenities.contains(amenity)) amenities - amenity else amenities + amenity
                                },
                                label = { Text(amenity) }
                            )
                        }
                    }
                    OutlinedTextField(value = moveInDate, onValueChange = { moveInDate = it }, label = { Text("Move-in Date (YYYY-MM-DD)") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    OutlinedTextField(value = leaseDuration, onValueChange = { leaseDuration = it }, label = { Text("Lease Duration (months)") }, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp))
                    DropdownMenuBox(label = "Billing Cycle", options = billingCycleOptions, selected = billingCycle, onSelect = { billingCycle = it })
                    if (error.isNotEmpty()) Text(error, color = Color.Red, modifier = Modifier.padding(bottom = 4.dp))
                    if (success) Text("Preferences submitted successfully!", color = Color(0xFF059669), modifier = Modifier.padding(bottom = 4.dp))
                    Button(
                        onClick = { scope.launch { submit() } },
                        enabled = !loading,
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                    ) {
                        Text(if (loading) "Submitting..." else "Submit")
                    }
                }
            }
        }
    }
}

@Composable
fun DropdownMenuBox(label: String, options: List<String>, selected: String, onSelect: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box {
        OutlinedTextField(
            value = selected,
            onValueChange = {},
            label = { Text(label) },
            readOnly = true,
            modifier = Modifier.fillMaxWidth().clickable { expanded = true }
        )
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option ->
                DropdownMenuItem(text = { Text(option) }, onClick = {
                    onSelect(option)
                    expanded = false
                })
            }
        }
    }
}
