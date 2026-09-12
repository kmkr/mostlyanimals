const BASE = "https://s3.eu-central-1.amazonaws.com";
export const BUCKET = "splendid-nudibranch";
export { BASE };
export const S3_BASE = `${BASE}/${BUCKET}`;

export const resizeTo = [
  {
    name: "thumb",
    shortName: "thumb",
    width: 220,
  },
  {
    name: "xsmall",
    shortName: "xs",
    width: 500,
  },
  {
    name: "small",
    shortName: "s",
    width: 1000,
  },
  {
    name: "medium",
    shortName: "m",
    width: 1400,
  },
  {
    name: "large",
    shortName: "l",
    width: 1900,
  },
  {
    name: "xlarge",
    shortName: "xl",
    width: 2560,
  },
];
