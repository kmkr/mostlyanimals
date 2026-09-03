[![Build Status](https://travis-ci.org/kmkr/splendid-nudibranch.svg?branch=master)](https://travis-ci.org/kmkr/splendid-nudibranch)

# Manage photos

Set env variables:

```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

Install graphics magick:

```
sudo apt install graphicsmagick
```

## Upload

Upload new photos by running:

```
node photo-management/upload/upload.js <file path 1> <file path 2> <...>
```

This resizes variants, uploads them to S3, and prepends new entries directly to `content.json`. The order of entries in `content.json` defines their display order on the site.

## Edit content

Update `content.json` directly at will (titles, descriptions, locations, tags, or reordering entries). Commit your changes to git.

## Delete a photo

Delete a photo from S3 and remove it from `content.json` by running:

```
node photo-management/delete-photo.js <key>
```

You can also delete multiple keys at once:

```
node photo-management/delete-photo.js <key 1> <key 2> <...>
```

## Replace a photo

You can replace a photo and keep its key and order by running:

```
node photo-management/upload/upload.js --replace=<key> <file path>
```
