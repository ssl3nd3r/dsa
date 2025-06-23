package com.dubaiaccommodations.data.model

import java.util.Date

data class ServiceReview(
    val _id: String = "",
    val serviceProvider: String = "",
    val reviewer: User = User(),
    val rating: Int = 0,
    val title: String = "",
    val content: String = "",
    val serviceCategory: String = "",
    val serviceDate: Date = Date(),
    val qualityOfWork: Int = 0,
    val professionalism: Int = 0,
    val valueForMoney: Int = 0,
    val timeliness: Int = 0,
    val images: List<ServiceImage> = emptyList(),
    val isVerified: Boolean = false,
    val isApproved: Boolean = true,
    val isReported: Boolean = false,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
) 