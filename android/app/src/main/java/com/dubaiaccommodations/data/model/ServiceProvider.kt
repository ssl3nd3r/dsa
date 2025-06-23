package com.dubaiaccommodations.data.model

data class ServiceProvider(
    val _id: String = "",
    val businessName: String = "",
    val businessDescription: String = "",
    val phone: String = "",
    val email: String = "",
    val website: String? = null,
    val serviceAreas: List<String> = emptyList(),
    val services: List<Service> = emptyList(),
    val businessType: String = "",
    val licenseNumber: String = "",
    val emergencyService: Boolean = false,
    val rating: Rating = Rating(),
    val isVerified: Boolean = false,
    val images: List<ServiceImage> = emptyList(),
    val user: User = User()
)

data class Service(
    val category: String = "",
    val description: String = "",
    val priceRange: PriceRange = PriceRange()
)

data class PriceRange(
    val min: Double = 0.0,
    val max: Double = 0.0,
    val currency: String = "AED"
)

data class Rating(
    val average: Double = 0.0,
    val count: Int = 0
)

data class ServiceImage(
    val url: String = "",
    val caption: String = "",
    val isPrimary: Boolean = false
) 