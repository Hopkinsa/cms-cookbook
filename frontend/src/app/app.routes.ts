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
        path: 'backup',
        title: 'Backup / Restore | Cookbook',
        loadComponent: () =>
          import('./features/backup/backup.component').then((m) => m.BackupComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'recipe/add',
        title: 'Add Recipe | Cookbook',
        loadComponent: () =>
          import('./features/amend-recipe/amend-recipe.component').then((m) => m.AmendRecipeComponent),
        canActivate: [AuthGuard],
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
        path: 'amend-tags',
        title: 'Amend Categories and Tags | Cookbook',
        loadComponent: () => import('./features/amend-tags/amend-tags.component').then((m) => m.AmendTagsComponent),
        canActivate: [AuthGuard],
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
    ],
  },
];
