import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { AuthService, SignalService } from '@server/core/services';

type PasswordResetRequestFormModel = {
  login: string;
};

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [FormField, MatButtonModule, RouterLink, FeedbackComponent],
  templateUrl: './password-reset-request.component.html',
  styleUrl: './password-reset-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetRequestComponent {
  private authService: AuthService = inject(AuthService);
  private signalService: SignalService = inject(SignalService);

  protected readonly enableSubmit = signal(true);
  protected readonly issuedResetToken = signal('');
  protected readonly requestModel = signal<PasswordResetRequestFormModel>({ login: '' });
  protected readonly requestForm = form(this.requestModel);

  submit(event: Event): void {
    event.preventDefault();
    this.enableSubmit.set(false);
    this.issuedResetToken.set('');

    this.authService.requestPasswordReset(this.requestForm.login().value().trim()).subscribe((response) => {
      if (response.completed) {
        this.signalService.feedbackMessage.set({ type: 'success', message: response.message ?? 'Password reset requested' });
        this.issuedResetToken.set(response.resetToken ?? '');
      } else {
        this.signalService.feedbackMessage.set({ type: 'error', message: response.message ?? 'Unable to request password reset' });
      }

      this.enableSubmit.set(true);
    });
  }
}
