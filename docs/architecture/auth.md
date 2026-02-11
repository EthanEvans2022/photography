# Authentication & Authorization

## Auth Provider

<!-- What handles authentication? Already using Lucia — note any specifics. -->

**Provider:** Lucia
**Session storage:** <!-- database / cookie / etc. -->
**Session lifetime:** <!-- e.g. 30 days -->

## User Roles

| Role            | Description                          |
| --------------- | ------------------------------------ |
| <!-- role -->   | <!-- what this role can do -->       |

## Route Permissions

<!-- Which routes require what level of access? -->

| Route Pattern       | Required Role | Redirect On Fail      |
| ------------------- | ------------- | --------------------- |
| `/`                 | <!-- role --> | <!-- where -->        |
| `/photos`           | <!-- role --> | <!-- where -->        |
| `/photos/[id]`      | <!-- role --> | <!-- where -->        |
| `/admin/*`          | <!-- role --> | <!-- where -->        |
| <!-- route -->      | <!-- role --> | <!-- where -->        |

## Auth Flows

### Login

<!-- Step-by-step: what happens when a user logs in? -->

1. <!-- step -->

### Signup

<!-- Step-by-step: what happens when a user signs up? -->
<!-- Or note "no public signup" if admin-only. -->

1. <!-- step -->

### Logout

1. <!-- step -->

### Password Reset (if applicable)

1. <!-- step -->

## OAuth / Social Login (if applicable)

| Provider        | Scopes              | Notes                |
| --------------- | ------------------- | -------------------- |
| <!-- name -->   | <!-- scopes -->     | <!-- details -->     |

## Security Notes

<!-- Rate limiting, CSRF, brute force protection, etc. -->

- <!-- note -->
