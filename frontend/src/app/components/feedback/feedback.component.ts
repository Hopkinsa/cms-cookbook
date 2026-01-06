import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  protected signalService: SignalService = inject(SignalService);
  protected displayDuration = 1000;
  protected fadeInSpeed = this.displayDuration / 30;
  protected fadeOutSpeed = this.displayDuration / 10;

  private displayMessage = effect(() => {
    const feedback = this.signalService.feedbackMessage();
    if (feedback !== null) {
      const elm = document.getElementsByClassName('feedback-container')![0] as HTMLElement;
      this.fadeInit(elm);
    }
  });

  fadeInit(element: HTMLElement): void {
    element.style.display = 'flex';
    element.style.opacity = '0';
    this.fadeIncrement(element, this.fadeInSpeed);
  }

  fadeIncrement(element: HTMLElement, duration: number): void {
    element.style.opacity = String(parseFloat(element.style.opacity) + 0.1);

    if (parseFloat(element.style.opacity) <= 1) {
      setTimeout(() => {
        this.fadeIncrement(element, duration);
      }, this.fadeInSpeed);
    } else {
      element.style.opacity = '1';
      setTimeout(() => {
        this.fadeDecrement(element, this.fadeOutSpeed);
      }, this.displayDuration);
    }
  }

  fadeDecrement(element: HTMLElement, duration: number): void {
    element.style.opacity = String(parseFloat(element.style.opacity) - 0.1);
    if (parseFloat(element.style.opacity) <= 0) {
      element.style.opacity = '0';
      element.style.display = 'none';
      this.signalService.feedbackMessage.set(null);
    } else {
      setTimeout(() => {
        this.fadeDecrement(element, duration);
      }, this.fadeOutSpeed);
    }
  }
}
