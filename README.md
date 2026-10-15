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

Update `content.json` directly at will (titles, descriptions, locations, tags, or reordering entries). Wrap description text in underscores to display it in italics, for example `"An _italic_ word."`. Commit your changes to git.

Each photo has a persistent `sortIndex` that defines its preferred order. When
adding a photo manually in the middle of the catalog, give it a `sortIndex`
between its neighbors; higher values sort first, and the existing values use
gaps of 1000 to make this easy. Deleting a photo does not require renumbering.
The upload script assigns new photos values above the current maximum, and
replacing a photo preserves its index.

To arrange the catalog into three-photo desktop rows with alternating portrait positions, run:

```
npm run reorder-photos
```

This updates the array order in `content.json`, but leaves each `sortIndex`
unchanged. It starts from sort-index order and adjusts portrait placement only
when the movement of every affected photo stays within three rows (nine
positions), preserving a stable baseline across repeated runs. Featured and
non-featured photos are reordered separately, as before. Review and commit the
resulting order.

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

You can replace a photo and keep its key and order by specifying its key:

```
node photo-management/upload/upload.js --replace=<key> <file path>
```

If the key is omitted, the script finds the photo by the replacement file's
name in `content.json`. The name must match exactly one entry:

```
node photo-management/upload/upload.js --replace <file path>
```
