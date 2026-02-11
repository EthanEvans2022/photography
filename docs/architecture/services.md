# Services & Integrations

## Internal Services

<!-- Describe backend services/modules in your app. -->

### [ServiceName]

**Purpose:** <!-- one sentence -->
**Location:** <!-- e.g. src/lib/server/services/photos/ -->

**Methods:**

| Method           | Input              | Output             | Description              |
| ---------------- | ------------------ | ------------------ | ------------------------ |
| <!-- method -->  | <!-- params -->    | <!-- return -->    | <!-- what it does -->    |

**Notes:**
- <!-- implementation details, caching, error handling -->

---

## External Services

<!-- Third-party APIs, cloud services, etc. -->

| Service          | Purpose             | Auth Method         | Docs Link              |
| ---------------- | ------------------- | ------------------- | ----------------------- |
| <!-- name -->    | <!-- what for -->   | <!-- API key etc --> | <!-- url -->           |

## File Storage

<!-- Where do uploaded images / assets live? -->

**Provider:** <!-- local filesystem / S3 / R2 / Cloudinary / etc. -->
**Bucket/path:** <!-- details -->
**Access:** <!-- public URL / signed URL / proxied -->
**Max file size:** <!-- limit -->
**Allowed formats:** <!-- jpg, png, webp, etc. -->

## Image Processing

<!-- Any transformations, resizing, or optimization? -->

| Operation        | When                | Tool/Library        |
| ---------------- | ------------------- | ------------------- |
| <!-- op -->      | <!-- trigger -->    | <!-- tool -->       |

## Email (if applicable)

**Provider:** <!-- e.g. Resend, SendGrid, none -->
**Triggers:**

| Event            | Template            | Recipient           |
| ---------------- | ------------------- | ------------------- |
| <!-- event -->   | <!-- template -->   | <!-- who -->        |

## Environment Variables

<!-- List all required env vars so the app can be configured. -->
<!-- Do NOT put actual values here — just names and descriptions. -->

| Variable              | Description                    | Required |
| --------------------- | ------------------------------ | -------- |
| `DATABASE_URL`        | <!-- description -->           | yes      |
| <!-- var -->          | <!-- description -->           | <!-- --> |
