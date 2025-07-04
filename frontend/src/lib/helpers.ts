import { PropertyFilters } from "./slices/propertySlice";

export function mapFilters(filters: any): PropertyFilters {
  const res: any = {};
  if (filters.min_price) {
    res.min_price = filters.min_price;
  }
  if (filters.max_price) {
    res.max_price = filters.max_price;
  }
  if (filters.property_type) {
    res.property_type = {value: filters.property_type, label: filters.property_type};
  }
  if (filters.location) {
    const locations = filters.location.split(',');  
    res.location = locations.map((location: any) => ({value: location, label: location}));
  }
  if (filters.bedrooms) {
    res.bedrooms = filters.bedrooms;
  }
  if (filters.bathrooms) {
    res.bathrooms = filters.bathrooms;
  }
  if (filters.furnished) {
    res.furnished = filters.furnished;
  }
  if (filters.parking) {
    res.parking = filters.parking;
  }
  if (filters.lifestyle) {
    if (typeof filters.lifestyle === 'string' && filters.lifestyle.includes(',')) {
      res.lifestyle = filters.lifestyle.split(',');
    } else {
      res.lifestyle = filters.lifestyle;
    }
  }
  if (filters.personality_traits) {
    const traits = filters.personality_traits.split(',');
    res.personality_traits = traits.map((trait: any) => ({value: trait, label: trait}));
  } 
  if (filters.cultural_preferences) {
    const preferences = filters.cultural_preferences.split(',');
    res.cultural_preferences = preferences.map((preference: any) => ({value: preference, label: preference}));
  }
  if (filters.work_schedule) {
    res.work_schedule = filters.work_schedule;
  }
  return res;
}