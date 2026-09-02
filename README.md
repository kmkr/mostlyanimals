[![Build Status](https://travis-ci.org/kmkr/splendid-nudibranch.svg?branch=master)](https://travis-ci.org/kmkr/splendid-nudibranch)

# Manage photos

Set env variables:

```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export SN_DB_URL=mongodb+srv://user:pass@splendidnudibranch.nxtor.mongodb.net/splendid-nudibranch
```

Install graphics magick:

```
sudo apt install graphicsmagick
```

## Upload

Upload by running:

```
node photo-management/upload/upload.js <file path 1> <file path 2> <...>
```

## Update content

The content on the page is fetched from the db, but a copy in the repository exists too. The db will perhaps be removed in the future.

Ensure the local content.json copy is up to date by running:

```
node photo-management/pull-content.js
```

Update `content.json` at will. Sync your updates to the db by running:

```
node photo-management/update-content.js
```

To delete a photo, remove the entry in `content.json` and run the same command with "--delete" appended:

```
node photo-management/update-content.js --delete
```

## Replace a photo

You can replace the photo and keep its key by running:

```
node photo-management/upload/upload.js --replace=<key> <file path>
```

It's metadata will be reset so you need to update with:

```
node photo-management/update-content.js
```
