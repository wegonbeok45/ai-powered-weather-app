// Function to fetch location-based background images for ANY city worldwide
interface LocationImageData {
  uri: string;
  description?: string;
}

export async function fetchLocationImage(cityName: string): Promise<LocationImageData> {
  try {
    // Dynamic approach: Use Unsplash's source API which doesn't require API key
    // This will fetch images for ANY city in the world
    const normalizedCity = cityName.toLowerCase().trim();
    
    // Create search terms for better image results
    const searchTerms = [
      `${cityName} city skyline`,
      `${cityName} cityscape`,
      `${cityName} landmarks`,
      `${cityName} architecture`,
      `${cityName} downtown`
    ];
    
    // Try different search approaches for better results
    for (const searchTerm of searchTerms) {
      try {
        // Use Unsplash Source API (no API key required)
        const encodedSearch = encodeURIComponent(searchTerm);
        const imageUrl = `https://source.unsplash.com/800x600/?${encodedSearch}`;
        
        // Test if the image loads successfully
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
          return {
            uri: imageUrl,
            description: `Beautiful view of ${cityName}`
          };
        }
      } catch (error) {
        console.log(`Failed to fetch with search term: ${searchTerm}`);
        continue;
      }
    }

    // Enhanced fallback with more diverse city images
    const cityFallbackImages = [
      // Urban skylines
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', // City skyline
      'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80', // Urban landscape
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80', // City lights
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80', // Sunset cityscape
      
      // Architectural views
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Historic architecture
      'https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=800&q=80', // Modern architecture
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', // European architecture
      
      // Diverse cityscapes
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // Metropolitan view
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Asian cityscape
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Modern skyline
      
      // Waterfront cities
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Harbor city
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80', // Canal city
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80', // Coastal city
      
      // Cultural landmarks
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', // Historic landmarks
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80', // Cultural sites
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', // Traditional architecture
    ];

    // Use a more sophisticated hash to distribute cities across different image types
    const hash = cityName.split('').reduce((acc, char, index) => {
      return acc + char.charCodeAt(0) * (index + 1);
    }, 0);
    
    const fallbackIndex = hash % cityFallbackImages.length;

    return {
      uri: cityFallbackImages[fallbackIndex],
      description: `Scenic cityscape representing ${cityName}`
    };

  } catch (error) {
    console.error('Error fetching location image:', error);
    
    // Final fallback - a beautiful generic cityscape
    return {
      uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      description: 'Beautiful cityscape'
    };
  }
}

// Alternative function that tries to fetch from Unsplash API with more specific queries
export async function fetchLocationImageAdvanced(cityName: string): Promise<LocationImageData> {
  try {
    // This function uses more advanced search strategies
    const searchQueries = [
      `${cityName} city view`,
      `${cityName} skyline sunset`,
      `${cityName} architecture landmark`,
      `${cityName} urban landscape`,
      `${cityName} downtown night`,
      `${cityName} aerial view`,
      `${cityName} street photography`,
      `${cityName} travel destination`
    ];

    // Try each search query
    for (const query of searchQueries) {
      try {
        const encodedQuery = encodeURIComponent(query);
        const imageUrl = `https://source.unsplash.com/800x600/?${encodedQuery}`;
        
        // Add a random seed to get different images each time
        const randomSeed = Math.floor(Math.random() * 1000);
        const finalUrl = `${imageUrl}&sig=${randomSeed}`;
        
        return {
          uri: finalUrl,
          description: `${query} - Beautiful view of ${cityName}`
        };
      } catch (error) {
        continue;
      }
    }

    // If all queries fail, fall back to the basic function
    return fetchLocationImage(cityName);

  } catch (error) {
    console.error('Error in advanced location image fetch:', error);
    return fetchLocationImage(cityName);
  }
}
