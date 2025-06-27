// Profile related types
export interface UserProfile {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface EditProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
  }
  
  export interface EditProfileScreenProps {
    navigation: any;
    route?: {
      params?: {
        userProfile?: UserProfile;
        onProfileUpdate?: (profile: UserProfile) => void;
      };
    };
  }
  
  // API related types
  export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
    avatar?: string;
  }
  
  export interface UpdateProfileResponse {
    success: boolean;
    data: UserProfile;
    message: string;
  }
  
  export interface UploadAvatarRequest {
    file: {
      uri: string;
      type: string;
      name: string;
    };
  }
  
  export interface UploadAvatarResponse {
    success: boolean;
    data: {
      url: string;
    };
    message: string;
  }
  
  // Validation types
  export interface ValidationError {
    field: keyof EditProfileFormData;
    message: string;
  }
  
  export interface FormValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }
  
  // Image picker types
  export interface ImagePickerResult {
    uri: string;
    type: string;
    name: string;
    size: number;
  }