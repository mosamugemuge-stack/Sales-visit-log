export interface User {
  email: string;
  name: string;
  photoUrl?: string;
  isAdmin?: boolean;
}

export type FormStatus = 'Pending' | 'Completed';

export interface VisitLog {
  id: string; // Unique ID for local management
  CompanyName: string;
  UserEmail: string;
  CheckInTime: string; // ISO String
  CheckOutTime: string | null; // ISO String
  CheckInLat: number;
  CheckInLong: number;
  CheckOutLat: number | null;
  CheckOutLong: number | null;
  FormStatus: FormStatus | null;
  
  // Form Details
  ContactPerson: string;
  ContactPhone: string;
  ContactEmail: string;
  CustomerProducts: string;
  InterestedProducts: string;
  MOM: string; // Minutes of Meeting
}

export interface GeoLocation {
  lat: number;
  lng: number;
}