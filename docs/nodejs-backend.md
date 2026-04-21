# Node.js Backend

## Overview

The backend is an Express 5 + TypeScript API backed by SQLite through `better-sqlite3`.

It provides:

- recipe CRUD and search
- tag CRUD
- unit reads
- image upload, edit, delete, and listing
- backup export and restore import
- static image/template serving
- Angular app catch-all routing support when deployed together

## Stack

- Node.js
- TypeScript
- Express 5
- `better-sqlite3`
- `multer` for uploads
- `sharp` for image processing
- `adm-zip` for backup/restore archives
- Jest and ESLint for validation

## Install

From the repository root:

```bash
cd backend
npm install
```

## Run

Start the backend in development mode:

```bash
cd backend
npm start
```

The server listens on `http://localhost:3000`.

Important runtime details:

- Port is fixed in code as `3000`.
- JSON request bodies are enabled with a `100kb` limit.
- CORS is enabled.
- Static assets are served from `/image` and `/template`.

## Other Commands

```bash
cd backend
npm run lint
npm test
npm run test:report
```

## High-Level Structure

| Folder | Purpose |
| --- | --- |
| `src/api/recipe` | Recipe reads, writes, SQL, and query parsing |
| `src/api/tag` | Tag reads, writes, and SQL |
| `src/api/unit` | Unit reads and SQL |
| `src/api/images` | Image upload/edit/delete/list logic |
| `src/api/backup` | Backup archive generation |
| `src/api/restore` | Restore archive parsing and data import |
| `src/api/init` | Database initialization and seed data |
| `src/api/shared` | Shared read/write handler helpers |
| `src/routes` | Express route registration |
| `src/services` | Database connection service |
| `src/model` | Shared backend data types |

## Server Behavior

The Express app configures:

- `Access-Control-Allow-Origin: *`
- exposed header `x-total-count`
- JSON and URL-encoded body parsing
- `cors()` middleware
- static file serving:
	- `/image` -> uploaded images
	- `/template` -> template images

The app then mounts:

- file/image routes
- API routes
- a catch-all Angular response handler for non-API paths

## Base URLs

Local API base URL:

```text
http://localhost:3000/api/
```

Static file bases:

```text
http://localhost:3000/image/
http://localhost:3000/template/
```

## Data Models

### Response Envelope

```ts
type IResponse = {
	completed?: boolean;
	message?: string;
};
```

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
	date_created?: number;
	date_updated?: number;
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
type IUnit = {
	id: number;
	title: string;
	unit: string;
	abbreviation: string;
};
```

### Search Result

```ts
type ISearchResults = {
	total: number;
	page?: { offset: number; quantity: number };
	sort?: { target: string; direction: string };
	terms?: string;
	results: IRecipe[];
};
```

## Validation Rules

### Recipe body

- `title`: required, trimmed, escaped, minimum 5 characters
- `description`: trimmed and escaped
- `img_url`: trimmed and escaped
- `prep_time`: must contain numeric content
- `cook_time`: must contain numeric content
- `serves`: must contain numeric content
- `notes`: trimmed and escaped

### Tag body

- `type`: required
- `tag`: minimum 3 characters

### Search and sort query

- `terms`: required for `/api/search`
- `t`: optional, one of `title`, `created`, `updated`
- `d`: optional, one of `asc`, `desc`

## Endpoints

### Recipes

#### `GET /api/recipes`

Returns the full recipe list with sorting metadata.

Query parameters:

- `t`: sort target, one of `title`, `created`, `updated`
- `d`: sort direction, `asc` or `desc`

Example:

```http
GET /api/recipes?t=title&d=asc
```

Success response:

```json
{
	"total": 12,
	"page": { "offset": 0, "quantity": 0 },
	"sort": { "target": "title", "direction": "asc" },
	"results": []
}
```

#### `GET /api/search`

Searches recipes by text term.

Query parameters:

- `terms`: required search term
- `t`: optional sort target
- `d`: optional sort direction

Example:

```http
GET /api/search?terms=pasta&t=updated&d=desc
```

#### `GET /api/recipe/:id`

Returns a single recipe by numeric id.

Responses:

- `200`: recipe JSON
- `404`: `"Recipe not found"`

#### `POST /api/recipe`

Creates a recipe.

Request body:

```json
{
	"title": "Tomato Soup",
	"description": "Simple soup",
	"tags": ["Soup", "Vegetarian"],
	"img_url": "tomato-soup.jpg",
	"prep_time": 10,
	"cook_time": 30,
	"serves": 4,
	"ingredients": [],
	"steps": [],
	"notes": ""
}
```

Success response:

```json
{ "completed": true }
```

#### `PATCH /api/recipe/:id`

Updates a recipe and refreshes `date_updated`.

Success response:

```json
{ "completed": true }
```

#### `DELETE /api/recipe/:id`

Deletes a recipe by id.

Success response:

```json
{ "completed": true }
```

### Tags

#### `GET /api/tags`

Returns all tags.

#### `GET /api/tags/:id`

Returns one tag.

Responses:

- `200`: tag object
- `404`: `{ "message": "No tag found" }`

#### `POST /api/tags`

Creates a tag.

Request body:

```json
{
	"id": 0,
	"type": "Cuisine",
	"tag": "Italian"
}
```

Success response:

```json
{ "completed": true }
```

#### `PATCH /api/tags/:id`

Updates a tag. The route id must match `body.id`.

#### `DELETE /api/tags/:id`

Deletes a tag by id.

### Units

#### `GET /api/units`

Returns all units.

#### `GET /api/units/:id`

Returns one unit.

Responses:

- `200`: unit object
- `404`: `{ "message": "No unit found" }`

### Images

#### `GET /api/images`

Returns an array of uploaded image filenames.

#### `POST /api/images/upload`

Uploads an image file.

Request type:

- `multipart/form-data`
- file field name: `file`

Responses:

- `200`: `"File uploaded successfully!"`
- `400`: `"No file uploaded or invalid file type!"`

#### `POST /api/images/edit`

Creates or overwrites an edited image using crop data.

Request body:

```json
{
	"file": "source.jpg",
	"saveTo": "output.jpg",
	"cropBoxData": {}
}
```

Responses:

- `200`: empty string
- `400`: `"No file specified!"`
- `404`: `"Image not found"`

#### `DELETE /api/images/:name`

Deletes an image set by filename.

Responses:

- `200`: empty string
- `404`: `"Image not found"`

### Backup and Restore

#### `GET /api/backup`

Builds and downloads a zip archive containing tags, units, and recipes.

Success response:

- `200` binary download
- headers include:
	- `Content-Type: application/octet-stream`
	- `Content-Disposition: attachment; filename=<generated-name>`
	- `Content-Length: <size>`

Failure response:

```json
{ "completed": false }
```

#### `POST /api/restore`

Restores tags, units, and recipes from a zip archive upload.

Request type:

- `multipart/form-data`
- file field name: `file`

Success response:

```json
{ "completed": true }
```

Failure response:

```json
{ "completed": false }
```

If no uploaded file is present, the endpoint returns `400` with `{ "completed": false }`.

## Static Assets

The backend also serves image files directly.

- `/image/<filename>` serves uploaded images.
- `/template/<filename>` serves template images.

These paths are consumed directly by the Angular frontend.

## Notes for Frontend Integration

- Development frontend builds call `http://localhost:3000/api/` directly.
- Production frontend builds use relative API paths and can be hosted behind the same origin as the backend.
- There is no server-side auth layer on these endpoints; frontend edit restrictions are client-side only.
