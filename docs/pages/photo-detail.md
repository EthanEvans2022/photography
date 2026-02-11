# Page: Photo Detail (`/photos/[id]`)

## Purpose

This page is a full screen display of the selected photo, with image actions available on the top.
## Mockups

[Photos-details desktop](../design/mockups/googlephotos.png) 
[Photos-details mobile](../design/mockups/googlephotos-mobile.png)

## Layout

Pretty much one-to-one to the mockups. Instead of all the icon options shown, just provide the favorite and delete icon options as detailed in the photos page. Top left is a back arrow button, returning to the photos page.

| Viewport | Behavior                                            |
| -------- | --------------------------------------------------- |
| Desktop  | Same structure as the Photos-details desktop mockup |
| Tablet   | Same structure as the Photos-details desktop mockup |
| Mobile   | Same structure as the Photos-details mobile mockup  |

## Data Displayed

A singular Photo, as detailed in the photos page
## User Actions

| Action          | Trigger            | Result                |
| --------------- | ------------------ | --------------------- |
| <!-- action --> | <!-- click/tap --> | <!-- what happens --> |

## Navigation

Users get here by clicking on a photo from /photos. They leave by clicking the back arrow button top left of the screen.

Arrow keys cycle through photos. Also when mouse moves of the image, left and right arrows appear next to the photo and can be clicked to also cycle. They stay for three seconds before fading out.

## Auth Requirements

**Access:** Same auth access as detailed in photos. If someone does not have access, show a not permitted screen and a button to return to photos. 

## Notes

- <!-- note -->
