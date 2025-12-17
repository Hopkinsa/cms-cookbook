import { Component, effect, inject } from '@angular/core';

import { SignalService } from '@server/core/services/signal.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [],
  animations: [],
})
export class FeedbackComponent {
  protected signalService: SignalService = inject(SignalService);

  private displayMessage = effect(() => {
    const feedback = this.signalService.feedbackMessage();
    if (feedback !== null) {
      const elm = document.getElementsByClassName('feedback-container')![0] as HTMLElement;
      this.fade(elm, 1000);
    }
  })

  fade(element: HTMLElement, duration: number) {
    element.style.display = 'flex';
    element.style.opacity = '0';
    this.fadeIncrement(element, duration)
  };

  fadeIncrement(element: HTMLElement, duration: number) {
    element.style.opacity = String(parseFloat(element.style.opacity) + 0.1);

    if (parseFloat(element.style.opacity) < 1) {
      setTimeout(() => {
        this.fadeIncrement(element, duration);
      }, duration / 10);
    } else {
      element.style.opacity = '1';
      setTimeout(() => {
        this.fadeDecrement(element, duration / 2);
      }, duration * 2);
    }
  }

  fadeDecrement(element: HTMLElement, duration: number) {
    element.style.opacity = String(parseFloat(element.style.opacity) - 0.1);
    if (parseFloat(element.style.opacity) <= 0) {
      element.style.opacity = '0';
      element.style.display = 'none'
      this.signalService.feedbackMessage.set(null);
    } else {
      setTimeout(() => {
        this.fadeDecrement(element, duration);
      }, duration / 10);
    }
  };
}
