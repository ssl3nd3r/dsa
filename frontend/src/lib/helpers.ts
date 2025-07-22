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
  if (filters.room_type) {
    res.room_type = {value: filters.room_type, label: filters.room_type};
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

export function formatSelectValue(value: any) {
  if (typeof value === 'string') {
    if (value === '') {
      return null;
    }
    else {
      return {value: value, label: value};
    }
  }
  else if (typeof value === 'object') {
    return value;
  }
}

export const formatDate = (date: string) => {
  const msgDate = new Date(date);
  const now = new Date();

  const isToday =
    msgDate.getDate() === now.getDate() &&
    msgDate.getMonth() === now.getMonth() &&  
    msgDate.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = 
    msgDate.getDate() === yesterday.getDate() &&
    msgDate.getMonth() === yesterday.getMonth() &&
    msgDate.getFullYear() === yesterday.getFullYear();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const h = pad(msgDate.getHours()); 
  const m = pad(msgDate.getMinutes());

  if (isToday) {
    return `${h}:${m}`;
  } else if (isYesterday) {
    return `yesterday ${h}:${m}`;
  } else {
    return `${pad(msgDate.getDate())}/${pad(msgDate.getMonth() + 1)}/${msgDate.getFullYear()} ${h}:${m}`;
  }
}