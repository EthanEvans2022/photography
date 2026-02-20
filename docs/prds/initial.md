# Product Requirements Document (PRD)

## Personally Hosted Social Photo Platform

---

## 1. Product Overview

The product is a **personally hosted photo and video platform** that combines:

* Personal media storage functionality similar to **iCloud**, **Google Photos**, and **OneDrive**
* Social viewing and discovery experiences inspired by **Instagram** and **VSCO**

The platform will serve as the single authoritative repository for the owner’s photos and videos while enabling invited users (friends and family) to create accounts and view selected content.

The system emphasizes **data ownership, privacy, and intentional sharing**, with the owner retaining exclusive control over content creation and management.

---

## 2. Goals

### Primary Goals

* Provide a private, self-controlled media archive
* Enable selective sharing of photos/videos with trusted users
* Allow intuitive discovery of photos via tagging, metadata, and search
* Deliver a lightweight social browsing experience for viewers
* Preserve full data privacy and user autonomy

### Secondary Goals

* Replace dependence on third-party cloud photo storage platforms
* Provide a visually appealing browsing experience
* Enable identity-based discovery (finding photos containing specific people)
* Support future extensibility for additional social or storage features

---

## 3. Non-Goals (Initial Version)

* Multi-owner content creation (only one creator/admin)
* Public discovery or open social network features
* Monetization or advertising
* Marketplace or commercial usage
* Automated AI-based photo recognition as a required feature

---

## 4. Target Users

### 4.1 Owner (Admin)

The single creator and administrator of the platform who:

* Uploads and manages all media
* Creates and organizes albums
* Tags people and metadata
* Controls sharing permissions
* Manages user accounts

### 4.2 Viewer Users (Friends & Family)

Trusted users who:

* Create accounts
* Browse shared content
* Discover photos involving themselves
* Search and explore shared media

---

## 5. Core User Stories

### Owner

* As an owner, I can upload photos and videos to my personal library
* As an owner, I can edit or delete media
* As an owner, I can create, edit, and delete albums
* As an owner, I can tag people in media
* As an owner, I can tag contextual metadata within media
* As an owner, I can choose which users can view specific media or albums
* As an owner, I can manage viewer accounts

### Viewer

* As a viewer, I can create an account
* As a viewer, I can log in securely
* As a viewer, I can browse media shared with me
* As a viewer, I can view photos where I am tagged
* As a viewer, I can search shared content
* As a viewer, I can explore albums available to me

---

## 6. Functional Requirements

### 6.1 Media Library (Owner Only CRUD)

* Upload photos and videos
* Edit metadata associated with media
* Delete media
* View full personal library
* Bulk selection and operations
* Version persistence of media edits (optional future)

### 6.2 Albums

* Create albums
* Add/remove media from albums
* Edit album metadata (title, description, cover)
* Delete albums
* Share albums with selected users

### 6.3 User Accounts

* Account creation for invited users
* Authentication and session management
* Profile identity (name, avatar)
* Account management by owner

### 6.4 Sharing & Permissions

* Media-level sharing controls
* Album-level sharing controls
* User-specific visibility
* Default private state for all content

### 6.5 Tagging System

#### 6.5.1 People Tagging

* Tag one or multiple users in media
* Associate media with user identities
* Provide per-user media discovery feed

#### 6.5.2 Contextual Metadata Tagging

* Attach descriptive tags to media (events, objects, themes, locations, etc.)
* Support multiple tags per item
* Allow tag editing and deletion
* Enable search via tags

### 6.6 Search & Discovery

* Search by person
* Search by contextual tags
* Search by album
* Text-based search across metadata
* Browsable tag index

### 6.7 Viewer Experience

* Feed/grid browsing experience
* Album browsing
* Individual media viewer
* Tag-based navigation
* Personal “Photos of Me” view

---

## 7. Privacy & Data Principles

* Owner retains complete data control
* Default-private content model
* Explicit sharing required for visibility
* Manual tagging as primary discovery mechanism
* No mandatory automated analysis of media content
* No data use beyond platform functionality
* Clear separation between owner content and viewer access

---

## 8. Experience Requirements

### 8.1 Owner Experience

* Fast upload and organization workflow
* Minimal friction for tagging
* Clear sharing state visibility
* Centralized library overview
* Confidence in privacy controls

### 8.2 Viewer Experience

* Simple onboarding
* Clear understanding of available content
* Familiar browsing paradigms
* Intuitive discovery pathways
* Sense of personal connection via tagged content

---

## 9. Success Metrics

### Owner Metrics

* Percentage of personal media stored on platform
* Frequency of uploads
* Tag coverage ratio across library
* Album creation frequency

### Viewer Metrics

* Account activation rate
* Viewer session frequency
* Engagement with tagged content
* Search and discovery usage

### System Metrics

* Content organization completeness
* Sharing utilization
* Tag utilization
* Media retrieval success rate

---

## 10. Future Considerations (Not in Scope but Anticipated)

* Multi-owner contribution model
* Comments or lightweight reactions
* Collaborative albums
* Offline sync workflows
* Optional on-device automated tagging
* Mobile-native clients
* Export and backup tooling
* Activity notifications

---

## 11. Open Questions

* Granularity of sharing controls beyond user-level
* Tag taxonomy management approach
* Viewer interaction capabilities (if any)
* Backup and redundancy expectations
* Scale expectations for media volume
* Evolution toward broader social capabilities

---

## Summary

This product is a **private-first personal media hub with selective social sharing**, combining:

* A personal archival system
* A controlled social viewing layer
* Identity-based discovery through tagging
* Explicit privacy and ownership guarantees

The defining characteristic is that the platform remains **creator-owned infrastructure with invited social presence**, rather than a public social network or third-party storage dependency.

---
# PRD Addendum — Content Visibility & Permission Model

---

## 12. Content Visibility & Sharing Model

To support intentional sharing and controlled discovery, the platform will implement a **three-tier visibility model** applied at the media and album level.

All content will default to the most restrictive state.

---

## 12.1 Visibility Levels

### 12.1.1 Private (Default)

**Definition:**
Content is visible only to the owner/admin.

**Characteristics**

* Only the owner can view the content
* Content does not appear in any viewer feeds, search results, or albums
* Tags do not grant access
* Content remains part of the owner’s full library

**Primary Use Cases**

* Personal archival
* Draft uploads
* Content pending organization or tagging
* Sensitive media

---

### 12.1.2 Shared (Restricted Social)

**Definition:**
Content is visible to the owner and a defined subset of authenticated users.

**Access is granted through one or both mechanisms:**

1. Users explicitly granted permission
2. Users tagged within the media

**Characteristics**

* Requires viewer authentication
* Appears in viewer feeds, album views, and search results if access is granted
* Tagged users automatically gain viewing rights
* Owner can override access independent of tagging
* Supports both media-level and album-level sharing

**Primary Use Cases**

* Family photos
* Event galleries
* Photos containing specific individuals
* Small-group sharing

---

### 12.1.3 Public (Open Viewing)

**Definition:**
Content is visible to any visitor to the site without requiring authentication.

**Characteristics**

* Accessible to all site visitors
* Appears in public browsing surfaces
* Discoverable through public navigation and search
* Remains editable and removable only by owner
* Tagged users do not gain additional privileges beyond visibility

**Primary Use Cases**

* Portfolio content
* Highlight photos
* Travel or event showcases
* Content intentionally published broadly

---

## 12.2 Authentication Relationship to Visibility

| Visibility Level | Authentication Required    | Audience                 |
| ---------------- | -------------------------- | ------------------------ |
| Private          | Owner authentication       | Owner only               |
| Shared           | Viewer authentication      | Owner + authorized users |
| Public           | No authentication required | Any visitor              |

---

## 12.3 Functional Requirements

### Owner Capabilities

* Set visibility at upload
* Modify visibility at any time
* Apply visibility at media or album scope
* Bulk visibility changes
* View effective audience for any item
* Override tag-based access

### Viewer Capabilities

* View all content available under their permission scope
* Access “Shared With Me” surfaces
* Discover public content without authentication
* Access shared content only after authentication

---

## 12.4 Experience Requirements

### Owner

* Clear visibility indicator on all content
* Simple control to change visibility state
* Confidence in audience boundaries
* Visibility filtering in library views

### Viewer

* Clear understanding of accessible content
* Seamless transition from public browsing to authenticated shared viewing
* Personal feed reflecting shared and tagged media

---

## 12.5 Future Considerations

* Time-based sharing expiration
* Link-based temporary sharing
* Audience groups (e.g., Family, Friends)
* Visibility analytics
* Public profile pages

---

## Summary

The visibility model establishes a **privacy-first gradient of access**:

**Private → Shared → Public**

This framework enables:

* Secure personal archival
* Intentional small-group sharing
* Optional public presentation

while maintaining full owner control over content exposure.

---

