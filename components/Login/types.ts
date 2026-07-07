export interface LoginScreenProps {
  email: string;
  password: string;
  error: string | null;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onEnterDemo?: () => void;
  buttonText: string;
}
