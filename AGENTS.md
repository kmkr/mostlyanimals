This is a website displaying photos. The data source for images is S3, and the data source for photos is `content.json`. Uploading, deleting and editing S3 content is done via Node scripts in the ./photo-management folder. The web application just displays the photos. The application builds on Vercel, and each build pre-renders each of the photo detail pages and the front page.

## Features

- Infinity scroll of photos
- Desktop view renders a collage of around 3 photos per line. Mobile view with one photo per line.
- Each photo has a set of tags. At the top of the front page, the user can filter photos based on a few preselected tag badges.
- If a user opens a detail page, they are scrolled back to that photo if they go back to the front page.
- If a user has a tag badge selected, that tag badge should be kept if they open a photo and go back to the index page.

## Key files to edit

- For the web server, use the ./server folder
- For uploading and editing photos, use the ./server folder
- Client files are placed in the ./pages folder
