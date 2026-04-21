# Angular Frontend

## Overview

The frontend is an Angular 21 standalone application for browsing, searching, editing, backing up, and restoring cookbook content.

Key implementation details:

- Angular 21 with standalone components and lazy-loaded route components.
- Signal-based client state in `SignalService`.
- `httpResource()`-based reads for recipes, tags, units, and images.
- Angular Material for UI controls.
- Development mode talks directly to the backend API on `http://localhost:3000`.

## Prerequisites

- Node.js 20+ recommended.
- npm.
- The backend running on port `3000` for local development.

## Install

From the repository root:

```bash
cd frontend
npm install
```

## Run

Start the Angular development server:

```bash
cd frontend
npm start
```

The frontend runs at `http://localhost:4200`.

Development environment API settings:

- `baseApiURL`: `http://localhost:3000/api/`
- `baseImgURL`: `http://localhost:3000/image/`
- `baseTemplateURL`: `http://localhost:3000/template/`

Production builds switch these to relative paths:

- `/api/`
- `/image/`
- `/template/`

## Other Commands

```bash
cd frontend
npm run build
npm run lint
npm test
npm run test:report
```

## Frontend Routes

All routes are defined in `frontend/src/app/app.routes.ts` under the shared app template.

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Home page | Resolves units and tags |
| `/recipes` | Recipe results page | Resolves recipe list |
| `/recipe/:id` | Recipe detail | Resolves recipe, units, tags |
| `/recipe/add` | Add recipe | Guarded by client-side edit mode |
| `/recipe/:id/amend` | Edit recipe | Guarded, resolves recipe, units, tags, images |
| `/tags` | View categories and tags | Resolves tags |
| `/amend-tags` | Edit categories and tags | Guarded by client-side edit mode |
| `/units` | View units | Resolves units |
| `/images` | View uploaded images | Resolves image list |
| `/images/:name` | Amend image | Image editing flow |
| `/backup` | Backup and restore screen | Guarded by client-side edit mode |

## Client State and Data Loading

The frontend keeps shared state in `SignalService`.

Important signals:

- `recipeList`, `recipesFound`, `recipeSearch`, `filteredRecipeList`
- `recipe`, `recipeServes`, `ingredients`, `steps`
- `units`
- `tags`
- `pageIndex`, `pageSize`, `pageSort`
- `editEnabled`
- `feedbackMessage`

Resolvers trigger the initial data fetch for route entry. Examples:

- `recipeListResolver` triggers the recipe list request.
- `imagesResolver` loads the available uploaded images.
- `recipeResolver`, `tagResolver`, and `unitResolver` preload route data before the component renders.

## Edit Mode and Access

Restricted screens use a client-side guard, not a backend authentication system.

- `editEnabled` is stored in `localStorage` and synchronized across tabs.
- `AuthGuard` allows guarded routes only when `editEnabled()` is `true`.
- If edit mode is off, guarded routes redirect to `/`.

This is a UI-level protection only. Backend endpoints are not protected by server-side authentication.

## API Integration

The Angular app calls the backend through typed services in `frontend/src/app/core/services`.

### Recipes

Used by `RecipeService` and `RecipeListService`.

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/api/recipes?t=<target>&d=<direction>` | Load recipe list |
| `GET` | `/api/search?t=<target>&d=<direction>&terms=<query>` | Search recipes |
| `GET` | `/api/recipe/:id` | Load single recipe |
| `POST` | `/api/recipe` | Create recipe |
| `PATCH` | `/api/recipe/:id` | Update recipe |
| `DELETE` | `/api/recipe/:id` | Delete recipe |

Sorting values used by the UI:

- `t`: `title`, `created`, `updated`
- `d`: `asc`, `desc`

The recipes page also applies client-side tag filtering using `SignalService.recipeSearch.tags` and `tagMode`.

### Tags and Units

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/api/tags` | Load all tags |
| `GET` | `/api/tags/:id` | Load one tag |
| `POST` | `/api/tags` | Create tag |
| `PATCH` | `/api/tags/:id` | Update tag |
| `DELETE` | `/api/tags/:id` | Delete tag |
| `GET` | `/api/units` | Load all units |
| `GET` | `/api/units/:id` | Load one unit |

### Images

Used by `FileService` and the image amend/upload flows.

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/api/images` | Load uploaded image names |
| `POST` | `/api/images/upload` | Upload an image file |
| `POST` | `/api/images/edit` | Save cropped/edited image output |
| `DELETE` | `/api/images/:name` | Delete an image set |
| `GET` | `/image/:filename` | Serve uploaded image files |
| `GET` | `/template/:filename` | Serve template/static image assets |

### Backup and Restore

Used by `BackupService` and the backup page.

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/api/backup` | Download backup zip |
| `POST` | `/api/restore` | Upload restore zip using `multipart/form-data` |

The upload request uses a `FormData` field named `file`.

## Main Data Shapes

### Recipe

```ts
type IRecipe = {
	title: string;
	description: string;
	tags: string[];
	img_url: string;
	prep_time: number;
	cook_time: number;
	serves: number;
	ingredients?: IIngredients[];
	steps?: IStep[];
	notes: string;
	date_created: number;
	date_updated: number;
};
```

### Recipe List Result

```ts
type ISearchResults = {
	total: number;
	page?: { offset: number; quantity: number };
	sort?: { target: string; direction: string };
	terms?: string;
	results: IRecipeList[];
};
```

### Tag

```ts
type ITags = {
	id: number;
	type: string;
	tag: string;
};
```

### Unit

```ts
type IUnits = {
	id: number;
	title: string;
	unit: string;
	abbreviation: string;
};
```

## Development Notes

- Start the backend before using recipe, tag, unit, image, or backup features locally.
- The frontend does not define a dev proxy; it relies on the explicit development URLs in the environment files.
- Backup, restore, and editing screens rely on client-side edit mode being enabled in the UI.
