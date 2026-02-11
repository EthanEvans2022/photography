# Page: Photos (`/photos`)

## Purpose

This page is where I can view all my photos. The photos will be shown chronologically, with most recent photos first.
## Mockups

[Photos desktop](../design/mockups/icloud.png) 
[Photos connected apps dropdown](../design/mockups/icloud-apps-dropdown.png)
[Photos profile dropdown](../design/mockups/icloud-profile-dropdown.png)
[Photos mobile](../design/mockups/icloud-mobile.png)

For both examples, their is a left side navigation that opens and closed. There are three sections within said nav, 'Photos', 'Collections', and 'Sharing'. Do not have any sections. Instead, include only navigations for the 'Library', 'Favorites', and 'Albums'. 

At the top of the screen, is the root layout header with "Photos" on the left and a few buttons on its right. Make "Photos" into a breadcrumb, changing it to be "HomeHub/Photos". HomeHub will route to the root route, and will function as my own personal iCloud homepage, connecting multiple apps to one location.  Top right, do not include the first icon, which is an add icon. The second icon when clicked opens up a dropdown of other connected apps connected to the HomeHub. This will be based off of the Photos connected apps dropdown mockup. For now, have it just include a link to this Photos route and have it highlighted to show we are currently there. The last icon is a profile icon. When clicked, it opens a dropdown with the user's name, account settings, and a sign out option. This is based off of the Photos profile dropdown mockup.

At the top of the main section are more icons, again flexed with space-between. On the left are two icons and a zoom bar.  Add the zoom bar, as well as a filter icon to the zoom bar's left. When the filter button is clicked, a dropdown menu appears with the option to filter by date, tags, or people (detailed later). On the right side are a number of icons again. For now, only include a favorite button and a delete button. The Photo desktop picture shows them greyed out. When an image is clicked on, a border is placed around the image and those two buttons are enabled.


Instead of the blue color for the icons, replace that with the primary a0 color.
## Layout

| Viewport | Behavior                                    |
| -------- | ------------------------------------------- |
| Desktop  | Same structure as the Photos desktop mockup |
| Tablet   | Same structure as the Photos desktop mockup |
| Mobile   | Same structure as the Photos mobile mockup  |

## Data Displayed

This will be modular by environment variable configuration. Create an interface that is implemented by all photo services called 'IPhotoService'. It will have a 'getPhotos' and 'getPhoto' functions. Then, implement a LocalPhotoService that pulls photos from a temp test directory that you will create.

Here is this interface for a Photo:
```
interface Photo {
    id: string;
	owner: User;
    src: string;
	favorite: boolean;
	visibiltiy: 'public' | 'shared' | 'private';
	tags: string[];
	people: string[];
	metadata: {
		datetime: DateTime;
		location: {
			longitude: number;
			latitude: number;
		}
	}
}
```

The interface references a user for the owner field. This is connected to the auth strategy, to which I delegate to you for both implementation of as well as the definition of a user type.

There is also the "tags" property on the Photo interface. This will act like a hashtag on social media platforms, allowing for searching by tags.

There is also the "people" array. This will be an array of user-ids, allowing for tagging people to photos. This will also be used for searching.
## Filtering & Sorting

**Filtering:** can filter by a datetime span, tags, and people. All three can be applied at the same time. There is also a button to clear all filters. Each filter has its own section title.  For tags and people, follow the following rules:
* There is an add and clear icons to the right of the section titles
* When no tags or people are being filtered, a no tags/people message is shown in the section
* When the add is clicked, a search input appears with suggested results
* Only tags and people that are in the system can be filtered for. While the user types,   the three closest tags to what is being searched are pulled up, or if none, a no results found message. 
* When selected, the search input is disappears and the filter is shown under the section
* The filter is rendered as a Tag component. This component is a simple div wrapper around the name of the tag with an x button icon at its end. Clicking the x removes the filter. 
* Multiple tags and people can be applied to filters.

## Pagination

**Strategy:** Infinite scroll
Generate skeleton cards for each photo passed what is loaded while scrolling. Once scrolling stops, load in the skeletons that are visible.
## User Actions

| Action          | Trigger            | Result                |
| --------------- | ------------------ | --------------------- |
| <!-- action --> | <!-- click/tap --> | <!-- what happens --> |

## Auth Requirements

**Access:**  Anyone can access this page. However, which photos are available are determined by the following rules:
* Any image with the `visibility` property set to `public` are available to all.
* Any image with the `visibility` property set to `shared` are available to the owner and all users listed in the image's `people` array.
* Any image with the `visibility` property set to `private` are available to only to the owner of the photo.

## Notes

- <!-- note -->
