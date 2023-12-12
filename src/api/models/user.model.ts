import Settings from "./settings.model";

export default interface User {
  id: number;
  avatar: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_superuser: boolean;
  is_staff: boolean;
  settings: Settings;
}
