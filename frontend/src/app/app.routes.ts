import { Routes } from '@angular/router';

import { AuthGuard } from '@server/core/guard/auth.guard';
import {
  addRecipeResolver,
  imagesResolver,
  recipeListResolver,
  recipeResolver,
  tagResolver,
  unitResolver,
} from '@server/core/resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./template/template').then((m) => m.Template),
    children: [
      {
        path: '',
        title: 'Cookbook',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
        resolve: {
          unit: unitResolver,
          tag: tagResolver,
        },
      },
      {
        path: 'auth/login',
        title: 'Login | Cookbook',
        loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'auth/password-reset/request',
        title: 'Password Reset | Cookbook',
        loadComponent: () =>
          import('./features/password-reset-request/password-reset-request.component').then(
            (m) => m.PasswordResetRequestComponent,
          ),
      },
      {
        path: 'auth/password-reset/complete',
        title: 'Complete Password Reset | Cookbook',
        loadComponent: () =>
          import('./features/password-reset-complete/password-reset-complete.component').then(
            (m) => m.PasswordResetCompleteComponent,
          ),
      },
      {
        path: 'backup',
        title: 'Backup / Restore | Cookbook',
        loadComponent: () => import('./features/backup/backup.component').then((m) => m.BackupComponent),
        canActivate: [AuthGuard],
        data: {
          permissionsAny: ['backup.export', 'backup.restore'],
        },
      },
      {
        path: 'recipe/add',
        title: 'Add Recipe | Cookbook',
        loadComponent: () =>
          import('./features/amend-recipe/amend-recipe.component').then((m) => m.AmendRecipeComponent),
        canActivate: [AuthGuard],
        data: {
          permission: 'recipe.create',
        },
        resolve: {
          unit: unitResolver,
          tag: tagResolver,
          id: addRecipeResolver,
        },
      },
      {
        path: 'recipe/:id/amend',
        title: 'Amend Recipe | Cookbook',
        loadComponent: () =>
          import('./features/amend-recipe/amend-recipe.component').then((m) => m.AmendRecipeComponent),
        canActivate: [AuthGuard],
        data: {
          permission: 'recipe.update',
        },
        resolve: {
          unit: unitResolver,
          tag: tagResolver,
          id: recipeResolver,
          imagesResolver,
        },
      },
      {
        path: 'recipe/:id',
        title: 'Recipe | Cookbook',
        loadComponent: () =>
          import('./features/display-recipe/display-recipe.component').then((m) => m.DisplayRecipeComponent),
        resolve: {
          unit: unitResolver,
          tag: tagResolver,
          id: recipeResolver,
        },
      },
      {
        path: 'recipes',
        title: 'Recipes | Cookbook',
        loadComponent: () => import('./features/recipes/recipes.component').then((m) => m.RecipesComponent),
        resolve: {
          recipeListResolver,
        },
      },
      {
        path: 'units',
        title: 'Units | Cookbook',
        loadComponent: () =>
          import('./features/display-units/display-units.component').then((m) => m.DisplayUnitsComponent),
        resolve: {
          unit: unitResolver,
        },
      },
      {
        path: 'tags',
        title: 'Categories and Tags | Cookbook',
        loadComponent: () =>
          import('./features/display-tags/display-tags.component').then((m) => m.DisplayTagsComponent),
        resolve: {
          tag: tagResolver,
        },
      },
      {
        path: 'users',
        title: 'Users | Cookbook',
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
        canActivate: [AuthGuard],
        data: {
          permission: 'user.read',
        },
      },
      {
        path: 'amend-tags',
        title: 'Amend Categories and Tags | Cookbook',
        loadComponent: () => import('./features/amend-tags/amend-tags.component').then((m) => m.AmendTagsComponent),
        canActivate: [AuthGuard],
        data: {
          permissionsAny: ['tag.create', 'tag.update', 'tag.delete'],
        },
        resolve: {
          tag: tagResolver,
        },
      },
      {
        path: 'images',
        title: 'Images | Cookbook',
        loadComponent: () =>
          import('./features/display-images/display-images.component').then((m) => m.DisplayImagesComponent),
        resolve: {
          imagesResolver,
        },
      },
      {
        path: 'images/:name',
        title: 'Amend Image | Cookbook',
        loadComponent: () => import('./features/amend-image/amend-image.component').then((m) => m.AmendImageComponent),
        canActivate: [AuthGuard],
        data: {
          permission: 'image.update',
        },
      },
    ],
  },
];
