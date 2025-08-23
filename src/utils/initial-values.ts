import { ROLES } from '@/@types/enums';
import { CreateUser } from '@/@types/users';

export const initUser: CreateUser = {
  name: '',
  surname: '',
  email: '',
  role: ROLES.finance,
  password: '',
  fullName: '',
  username: '',
};
