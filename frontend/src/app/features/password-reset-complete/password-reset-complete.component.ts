import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { AuthService, SignalService } from '@server/core/services';

type PasswordResetCompleteFormModel = {
  token: string;
  password: string;
  confirmPassword: string;
};

@Component({
  selector: 'app-password-reset-complete',
  standalone: true,
  imports: [FormField, MatButtonModule, RouterLink, FeedbackComponent],
  templateUrl: './password-reset-complete.component.html',
  styleUrl: './password-reset-complete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetCompleteComponent {
  private authService: AuthService = inject(AuthService);
  private signalService: SignalService = inject(SignalService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  protected readonly enableSubmit = signal(true);
  protected readonly resetModel = signal<PasswordResetCompleteFormModel>({ token: '', password: '', confirmPassword: '' });
  protected readonly resetForm = form(this.resetModel);

  private readonly tokenPrefill = effect(() => {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.resetModel.update((current) => ({ ...current, token: queryToken }));
    }
  });

  submit(event: Event): void {
    event.preventDefault();

    if (this.resetForm.password().value() !== this.resetForm.confirmPassword().value()) {
      this.signalService.feedbackMessage.set({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    this.enableSubmit.set(false);
    this.authService.completePasswordReset(this.resetForm.token().value().trim(), this.resetForm.password().value()).subscribe((response) => {
      if (response.completed) {
        this.signalService.feedbackMessage.set({ type: 'success', message: 'Password updated' });
        this.router.navigate(['/auth/login']);
      } else {
        this.signalService.feedbackMessage.set({ type: 'error', message: 'Unable to update password' });
      }

      this.enableSubmit.set(true);
    });
  }
}
