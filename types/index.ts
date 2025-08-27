// Password Management Types
export interface PasswordEntry {
  id: string;
  platform: string;
  platform_url?: string;
  platform_username?: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface AddPasswordData {
  platform: string;
  platform_url?: string;
  platform_username?: string;
  password: string;
  master_password: string;
}

export interface DecryptPasswordData {
  passwordId: string;
  masterPassword: string;
}

export interface DeletePasswordData {
  passwordId: string;
  masterPassword: string;
}

// Modal Component Props
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AddPasswordModalProps extends ModalProps {
  onPasswordAdded?: () => void;
}

export interface ViewPasswordModalProps extends ModalProps {
  passwordEntry: PasswordEntry;
}

export interface DeletePasswordModalProps extends ModalProps {
  passwordEntry: PasswordEntry;
  onPasswordDeleted?: () => void;
}

// Alert Component Types
export interface AppAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onSuccessClose?: () => void;
  linkTo?: string;
  type?: "success" | "error";
}

// Dialog Component Types
export interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DecryptResponse {
  password: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  masterPassword: string;
  confirmMasterPassword: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Search and Filter Types
export interface SearchFilters {
  platform?: string;
  username?: string;
  searchTerm?: string;
}
