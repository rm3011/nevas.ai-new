# NEVAS.AI

NEVAS.AI is a React, TypeScript, and Vite site. React Router renders the shared
site shell and its pages:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/blogs` | Published articles |
| `/blogs/:slug` | Article detail |
| Other paths | Not found |

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run lint
npm run typecheck
npm run build
```

## Sanity

The browser reads published posts from the Sanity project configured in
`src/lib/sanity.ts`. Add each development and production site origin to that
project's **Manage > API > CORS origins** settings (for example,
`http://localhost:5173`, `http://127.0.0.1:5173`, and the deployed site origin).
These are public, read-only frontend requests and should not use credentials.
Until the current site's origin is allowed, the Sanity API will reject browser
requests and the blog pages will show their error state.

Blog cards use locally rendered branded cover artwork when a post has no
`mainImage` or its image cannot be loaded. To display actual article photos,
upload and set each post's `mainImage` in Sanity Studio.

Article detail pages expect Sanity `post` documents to include a `body` Portable
Text field. If a post has no `body`, the detail page displays its available
metadata and an explanatory message.
