import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { AuthService, SignalService } from '@server/core/services';

type LoginFormModel = {
  login: string;
  password: string;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, MatButtonModule, RouterLink, FeedbackComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private signalService: SignalService = inject(SignalService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  protected readonly enableSubmit = signal(true);
  protected readonly loginModel = signal<LoginFormModel>({ login: '', password: '' });
  protected readonly loginForm = form(this.loginModel);

  submit(event: Event): void {
    event.preventDefault();
    this.enableSubmit.set(false);

    this.authService
      .login({
        login: this.loginForm.login().value().trim(),
        password: this.loginForm.password().value(),
      })
      .subscribe((sessionState) => {
        if (sessionState.authenticated) {
          this.signalService.feedbackMessage.set({ type: 'success', message: 'Logged in' });
          const returnTo = this.route.snapshot.queryParamMap.get('returnTo') ?? '/';
          this.router.navigateByUrl(returnTo);
        } else {
          this.signalService.feedbackMessage.set({ type: 'error', message: 'Unable to login' });
        }

        this.enableSubmit.set(true);
      });
  }
}
