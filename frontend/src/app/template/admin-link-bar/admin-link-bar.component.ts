import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { type AuthPermissionCode } from '@server/core/interface';
import { AuthService } from '@server/core/services/auth.service';
import { SignalService } from '@server/core/services/signal.service';

type AdminLink = {
  route: string;
  label: string;
  permissionsAny?: readonly AuthPermissionCode[];
};
@Component({
  selector: 'app-admin-link-bar',
  templateUrl: './admin-link-bar.component.html',
  styleUrl: './admin-link-bar.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLinkBarComponent {
  private router: Router = inject(Router);
  protected authService: AuthService = inject(AuthService);
  protected signalService: SignalService = inject(SignalService);
  readonly links: readonly AdminLink[] = [
    { route: '/tags', label: 'Tags' },
    { route: '/images', label: 'Images' },
    { route: '/units', label: 'Units' },
    { route: '/backup', label: 'Backup', permissionsAny: ['backup.export', 'backup.restore'] },
    { route: '/users', label: 'Users', permissionsAny: ['user.read'] },
  ];

  nav(idx: number): void {
    this.router.navigate([this.links[idx].route]);
  }

  showLink(link: AdminLink): boolean {
    return !link.permissionsAny || this.signalService.hasAnyPermission(link.permissionsAny);
  }

  authAction(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
      return;
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnTo: this.router.url } });
  }
}
