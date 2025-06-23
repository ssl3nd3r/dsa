package com.dubaiaccommodations.data.model

data class OnboardingData(
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val lifestyle: String = "",
    val personalityTraits: Set<String> = emptySet(),
    val workSchedule: String = "",
    val languages: Set<String> = emptySet(),
    val dietary: String = "",
    val religion: String = ""
) {
    fun isValid(): Boolean {
        return name.isNotBlank() &&
                email.isNotBlank() &&
                password.length >= 6 &&
                lifestyle.isNotBlank() &&
                personalityTraits.isNotEmpty() &&
                workSchedule.isNotBlank() &&
                languages.isNotEmpty()
    }

    fun toApiRequest(): Map<String, Any> {
        return mapOf(
            "name" to name,
            "email" to email,
            "password" to password,
            "lifestyle" to lifestyle,
            "personalityTraits" to personalityTraits.toList(),
            "workSchedule" to workSchedule,
            "culturalPreferences" to mapOf(
                "languages" to languages.toList(),
                "dietary" to dietary,
                "religion" to religion
            )
        )
    }
}

data class User(
    val id: String,
    val name: String,
    val email: String,
    val lifestyle: String,
    val personalityTraits: List<String>,
    val workSchedule: String,
    val culturalPreferences: CulturalPreferences,
    val isVerified: Boolean = false,
    val createdAt: String
)

data class CulturalPreferences(
    val languages: List<String>,
    val dietary: String?,
    val religion: String?
)

data class Property(
    val id: String,
    val title: String,
    val description: String,
    val area: String,
    val address: Address,
    val propertyType: String,
    val roomType: String,
    val size: Int,
    val bedrooms: Int,
    val bathrooms: Int,
    val price: Double,
    val currency: String,
    val billingCycle: String,
    val amenities: List<String>,
    val images: List<PropertyImage>,
    val owner: User,
    val matchingScore: Int? = null,
    val isAvailable: Boolean = true
)

data class Address(
    val fullAddress: String,
    val street: String? = null,
    val building: String? = null,
    val floor: String? = null,
    val apartment: String? = null
)

data class PropertyImage(
    val url: String,
    val caption: String? = null,
    val isPrimary: Boolean = false
)

data class ApiResponse<T>(
    val data: T? = null,
    val message: String? = null,
    val error: String? = null
)

data class PaginatedResponse<T>(
    val properties: List<T>,
    val pagination: Pagination
)

data class Pagination(
    val current: Int,
    val total: Int,
    val hasMore: Boolean
) 