"use client"

import { useState, useEffect } from "react"

interface GeolocationData {
  city: string | null
  country: string | null
  region: string | null
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [data, setData] = useState<GeolocationData>({
    city: null,
    country: null,
    region: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Check if we already have cached data in sessionStorage
    const cachedData = sessionStorage.getItem("geolocation_data")
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        setData({
          ...parsed,
          loading: false,
          error: null,
        })
        return
      } catch (error) {
        console.error("Error parsing cached geolocation data:", error)
      }
    }

    // Fetch geolocation data from ipinfo.io
    const fetchGeolocation = async () => {
      try {
        const response = await fetch("https://ipinfo.io/json?token=9da2ab93deea98")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        const locationData = {
          city: result.city || null,
          country: result.country || null,
          region: result.region || null,
        }

        // Cache the result in sessionStorage
        sessionStorage.setItem("geolocation_data", JSON.stringify(locationData))

        setData({
          ...locationData,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching geolocation:", error)
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch location",
        }))
      }
    }

    fetchGeolocation()
  }, [])

  return data
}
