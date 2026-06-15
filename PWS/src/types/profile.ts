export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  countryCode: string;
  email: string;
}

export interface SavedPaymentMethod {
  type: string;
  details: string;
}

export interface ProfileFormData {
  familyRelation?: string;
  language: string;
  languageFlag: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  countryCode: string;
  countryFlag: string;
  email: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
  streetAddress: string;
  postalCode: string;
  city: string;
  province: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  gender: string;
  pronouns: string;
  heightValue: number;
  heightUnit: string;
  weightValue: number;
  weightUnit: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyEmail: string;
  emergencyCountryCode: string;
  emergencyContacts: EmergencyContact[];
  careConditions: string[];
  careServices: string[];
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardCountry: string;
  cardPostal: string;
  paypalEmail: string;
  bitcoinWallet: string;
  profilePhoto: string;
  savedPaymentMethods: SavedPaymentMethod[];
  stripeEmail?: string;
}

export interface ProfileErrors {
  username: string;
  gender?: string;
  certFile?: string;
  backcheckFile?: string;
  payout?: string;
}

export interface ProviderProfileFormData {
  appLanguage: string;
  spokenLanguages: string[];
  firstName: string;
  lastName: string;
  professionalTitle: string;
  profilePhoto: string;
  email: string;
  phone: string;
  countryCode: string;
  countryFlag: string;
  altContactName: string;
  altContactPhone: string;
  altCountryCode: string;
  altCountryFlag: string;
  smsAlerts: boolean;
  emailAlerts: boolean;
  messageAlerts: boolean;
  streetAddress: string;
  postalCode: string;
  city: string;
  province: string;
  serviceRadius: number;
  gender: string;
  pronouns: string;
  showGender: boolean;
  pswCertificate: string | null;
  pswCertificateName: string;
  backgroundCheck: string | null;
  backgroundCheckName: string;
  yearsExperience: string;
  specializations: string[];
  professionalBio: string;
  services: string[];
  availability: Record<string, Record<string, boolean>>;
  height: string;
  weight: string;
  heightValue: number;
  heightUnit: string;
  weightValue: number;
  weightUnit: string;
  hasVehicle: boolean;
  driversLicense: string;
  usesPublicTransit: boolean;
  usesBicycle: boolean;
  physicalCapabilities: string[];
  payoutMethod: string;
  accountHolderName: string;
  institutionNumber: string;
  transitNumber: string;
  accountNumber: string;
  bankName: string;
  stripeEmail: string;
  paypalEmail: string;
  interacEmail: string;
  debitCardName: string;
  debitCardNumber: string;
  debitCardExpiry: string;
  username: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}
