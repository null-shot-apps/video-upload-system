export type UserRole = 'Landlord' | 'Agent' | 'Tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface VideoFile {
  id: string;
  file: File;
  duration: number;
  size: number;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface PropertyDetails {
  state: string;
  city: string;
  area: string;
  annualRent: number;
  agencyFee: number;
  legalFee: number;
  cautionFee: number;
  powerSupply: string;
  waterSource: string;
}

export interface PropertyListing {
  id: string;
  userId: string;
  videos: string[];
  details: PropertyDetails;
  createdAt: Date;
  status: 'draft' | 'published';
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export const POWER_SUPPLY_OPTIONS = [
  '24/7 Power',
  'Stable (20+ hours daily)',
  'Moderate (12-20 hours daily)',
  'Limited (Less than 12 hours daily)',
  'Generator Only',
  'Solar Available',
  'Prepaid Meter',
  'Postpaid Meter'
];

export const WATER_SOURCE_OPTIONS = [
  'Borehole',
  'Well',
  'Public Water Supply',
  'Water Vendor',
  'Borehole + Public Supply',
  'Well + Borehole',
  'Water Treatment Plant'
];

