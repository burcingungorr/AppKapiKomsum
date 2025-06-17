interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  city: string | null;
  district: string | null;
  town: string | null;
  neighborhood: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}
