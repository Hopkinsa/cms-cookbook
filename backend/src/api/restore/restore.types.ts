import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import {
  type PasswordResetTokenTableRecord,
  type PermissionTableRecord,
  type UserPermissionTableRecord,
  type UserTableRecord,
} from '../../auth/auth.types.ts';

export type RestoreArchiveData = {
  tags: ITags[];
  units: IUnit[];
  recipes: ICard[];
  users: UserTableRecord[];
  permissions: PermissionTableRecord[];
  userPermissions: UserPermissionTableRecord[];
  passwordResetTokens: PasswordResetTokenTableRecord[];
};
