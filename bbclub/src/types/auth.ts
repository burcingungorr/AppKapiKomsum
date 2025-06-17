type AuthButtonProps = {
  button: string;
  onPress: () => void;
};
type LoginAreaProps = {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  error?: string;
};

interface FormValues {
  username: string;
  email: string;
  password: string;
  city: string;
  district: string;
  town: string;
  neighborhood: string;
}
interface LocationModalProps {
  visible: boolean;
  level: 'city' | 'district' | 'town' | 'neighborhood' | null;
  items: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
}
interface LocationSelectorProps {
  label: string;
  onPress: () => void;
  error?: string;
  disabled?: boolean;
}
interface FormInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}
