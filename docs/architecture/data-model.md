# Data Model

## Entity Overview

<!-- List all entities and a one-line description. -->

| Entity          | Description                  |
| --------------- | ---------------------------- |
| <!-- entity --> | <!-- what it represents -->  |

## Entity Definitions

<!-- Copy this block for each entity. -->

### [EntityName]

**Table name:** `<!-- table_name -->`

| Field           | Type              | Required | Unique | Notes                  |
| --------------- | ----------------- | -------- | ------ | ---------------------- |
| `id`            | <!-- type -->     | yes      | yes    | Primary key            |
| <!-- field -->  | <!-- type -->     | <!-- --> | <!-- -->| <!-- details -->       |

**Indexes:**
- <!-- index description, e.g. "compound index on (user_id, created_at)" -->

---

## Relationships

<!-- Describe how entities relate to each other. -->

| Relationship              | Type        | Notes                         |
| ------------------------- | ----------- | ----------------------------- |
| <!-- Entity → Entity -->  | <!-- 1:N --> | <!-- cascade? optional? -->  |

## Enums / Constants

<!-- Any fixed value sets used across the model. -->

### [EnumName]

| Value           | Description                |
| --------------- | -------------------------- |
| <!-- value -->  | <!-- what it means -->     |

## Migration Notes

<!-- Any ordering concerns, seed data requirements, or breaking changes to flag. -->

- <!-- note -->
