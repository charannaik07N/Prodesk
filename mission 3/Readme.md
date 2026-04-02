# Mission 3

Mission 3 is a GitHub user search project called Dev-Detective. It lets you look up a GitHub profile and display user details in a clean dashboard-style layout.

## Live Preview

- https://prodesk-fyr8.vercel.app/

## What it does

- Fetches GitHub user data from the public API
- Shows profile details such as name, bio, followers, repository count, and links
- Displays a loading spinner while the API request is in progress
- Shows a clear error state when the user is not found
- Supports battle mode logic for comparing users

## Project files

- [index.html](index.html) - main page structure
- [index.js](index.js) - API calls, rendering, and error handling
- [style.css](style.css) - spinner and styling

## Notes

This mission focused on fixing the loading state, improving API error handling, and making sure variables such as `error` and `winner` are handled correctly before use.
