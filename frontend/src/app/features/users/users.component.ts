import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import {
  authPermissionCodes,
  type AuthPermissionCode,
  type AuthUser,
  type AuthUserUpsert,
} from '@server/core/interface';
import { AuthService, SignalService } from '@server/core/services';

type UserFormModel = {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
};

const userFormInitialState: UserFormModel = {
  firstName: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  isActive: true,
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormField, MatButtonModule, FeedbackComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private router: Router = inject(Router);
  protected authService: AuthService = inject(AuthService);
  protected signalService: SignalService = inject(SignalService);

  protected readonly users = computed(() => this.authService.users() ?? []);
  protected readonly editingUserId = signal<number | null>(null);
  protected readonly selectedPermissions = signal<AuthPermissionCode[]>([]);
  protected readonly enableSave = signal(true);
  protected readonly userModel = signal<UserFormModel>({ ...userFormInitialState });
  protected readonly userForm = form(this.userModel);
  protected readonly permissionCodes = authPermissionCodes;
  protected readonly canCreateUser = computed(() => this.signalService.hasPermission('user.create'));
  protected readonly canUpdateUser = computed(() => this.signalService.hasPermission('user.update'));
  protected readonly canShowEditor = computed(() => this.canCreateUser() || this.canUpdateUser());
  protected readonly canSubmitUser = computed(() => (this.editingUserId() === null ? this.canCreateUser() : this.canUpdateUser()));

  constructor() {
    this.refreshUsers();
  }

  hasSelectedPermission(permission: AuthPermissionCode): boolean {
    return this.selectedPermissions().includes(permission);
  }

  togglePermission(permission: AuthPermissionCode, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentPermissions = this.selectedPermissions();

    if (checked && !currentPermissions.includes(permission)) {
      this.selectedPermissions.set([...currentPermissions, permission]);
      return;
    }

    if (!checked) {
      this.selectedPermissions.set(currentPermissions.filter((currentPermission) => currentPermission !== permission));
    }
  }

  edit(user: AuthUser): void {
    if (!this.canUpdateUser()) {
      return;
    }

    this.editingUserId.set(user.id);
    this.userModel.set({
      firstName: user.firstName,
      surname: user.surname,
      username: user.username,
      email: user.email,
      password: '',
      isActive: user.isActive,
    });
    this.selectedPermissions.set([...user.permissions]);
  }

  startCreate(): void {
    if (!this.canCreateUser()) {
      return;
    }

    this.resetForm();
  }

  remove(user: AuthUser): void {
    this.authService.deleteUser(user.id).subscribe((response) => {
      if (response.completed) {
        this.signalService.feedbackMessage.set({ type: 'success', message: 'User deleted' });
        this.refreshUsers();
      } else {
        this.signalService.feedbackMessage.set({ type: 'error', message: 'Unable to delete user' });
      }
    });
  }

  resetForm(): void {
    this.editingUserId.set(null);
    this.userModel.set({ ...userFormInitialState });
    this.selectedPermissions.set([]);
  }

  save(event: Event): void {
    event.preventDefault();

    if (!this.canSubmitUser()) {
      this.signalService.feedbackMessage.set({ type: 'error', message: 'You do not have permission to save users' });
      return;
    }

    this.enableSave.set(false);

    const requestBody: AuthUserUpsert = {
      firstName: this.userForm.firstName().value().trim(),
      surname: this.userForm.surname().value().trim(),
      username: this.userForm.username().value().trim(),
      email: this.userForm.email().value().trim(),
      isActive: this.userForm.isActive().value(),
      permissions: this.selectedPermissions(),
      password: this.userForm.password().value().trim() || undefined,
    };

    const saveRequest = this.editingUserId() === null
      ? this.authService.createUser({ ...requestBody, password: requestBody.password ?? '' })
      : this.authService.updateUser(this.editingUserId()!, requestBody);

    saveRequest.subscribe((saveResult) => {
      if (saveResult.user) {
        this.signalService.feedbackMessage.set({
          type: 'success',
          message: this.editingUserId() === null ? 'User created' : 'User saved',
        });
        this.refreshUsers();
        this.resetForm();
      } else {
        this.signalService.feedbackMessage.set({ type: 'error', message: saveResult.message ?? 'Unable to save user' });
      }

      this.enableSave.set(true);
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  private refreshUsers(): void {
    this.authService.loadUsers().subscribe();
  }
}
