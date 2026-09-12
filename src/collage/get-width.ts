// Can't run server side!

export default function getWidth(): number {
  const documentWithScrollWidth = document as Document & {
    scrollWidth?: number;
  };
  return (
    documentWithScrollWidth.scrollWidth ||
    document.body.clientWidth ||
    window.innerWidth
  );
}
