# 📮 TimeEcho Frontend cURL Reference

Collection of cURL requests used by the frontend to interact with the TimeEcho Rails 8 API backend (`/api/v1`).

---

## 📬 List Stamps with Filtering & Pagination

Endpoint to retrieve the postage stamp catalog filtered by category, search query, and pagination parameters.

```bash
curl --location 'http://localhost:3000/api/v1/stamps?category=small-things&q=coffee&page=1&per_page=20' \
    --header 'Accept: application/json' \
    --header 'Accept-Language: en' \
    --header 'Authorization: Bearer b9187a1102f00429ed165330d90997cc716c4c2bda1f240e'
```

### Query Parameters

| Parameter  | Type                 | Required | Description                                                                                                        | Example        |
| :--------- | :------------------- | :------- | :----------------------------------------------------------------------------------------------------------------- | :------------- |
| `category` | `string`             | No       | Filter by category slug (`small-things`, `places-i-inhabit`, `stored-thoughts`, `passage-of-time`) or category ID. | `small-things` |
| `q`        | `string`             | No       | Search query matching stamp slug or localized name in English and Spanish (`name`, `query` also accepted).         | `coffee`       |
| `page`     | `integer`            | No       | Page number for paginated results (default: `1`).                                                                  | `1`            |
| `per_page` | `integer`            | No       | Number of records per page (default: `20`, clamped to maximum `100`).                                              | `20`           |
| `active`   | `string` / `boolean` | No       | Activation filter (`true`, `false`, or `all`). Defaults to `true` (active stamps in active categories).            | `true`         |

### Request Headers

| Header            | Value              | Description                                                                           |
| :---------------- | :----------------- | :------------------------------------------------------------------------------------ |
| `Accept`          | `application/json` | Requests JSON response format.                                                        |
| `Accept-Language` | `en` or `es`       | Selects locale for localized stamp names and descriptions (`X-Locale` also accepted). |
| `Authorization`   | `Bearer <token>`   | User session authentication bearer token.                                             |

### Sample JSON Response

```json
{
  "stamps": [
    {
      "slug": "morning-coffee",
      "name": "Morning Coffee",
      "category_slug": "small-things",
      "categorySlug": "small-things",
      "position": 1,
      "active": true,
      "svg_content": "<svg ...></svg>",
      "svgContent": "<svg ...></svg>"
    }
  ],
  "data": [
    {
      "slug": "morning-coffee",
      "name": "Morning Coffee",
      "category_slug": "small-things",
      "categorySlug": "small-things",
      "position": 1,
      "active": true,
      "svg_content": "<svg ...></svg>",
      "svgContent": "<svg ...></svg>"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### Frontend Implementation

In the frontend repository adapter layer:

- **Repository Method**: `HttpApiRepository#getStamps(locale, filters)` in `src/lib/repositories/HttpApiRepository.ts`
- **Filter Interface**: `StampFilters` in `src/types/timeecho.ts`
- **Hook**: `useStampCatalog#fetchFilteredStamps(filters)` in `src/components/stamps/useStampCatalog.ts`
