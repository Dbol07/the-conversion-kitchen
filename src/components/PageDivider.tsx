export default function PageDivider({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="Section divider"
      className="w-full max-w-xl mx-auto opacity-90 my-6"
      loading="lazy"
    />
  );
}
