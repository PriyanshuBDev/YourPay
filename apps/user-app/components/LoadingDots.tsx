export default function LoadingDots({
  size,
  bg,
}: {
  size: string;
  bg: string;
}) {
  const h = `h-${size}`;
  const w = `w-${size}`;
  return (
    <span className="flex space-x-1">
      <span
        className={`${h} ${w} ${bg} rounded-full animate-bounce [animation-delay:-0.3s]`}
      ></span>
      <span
        className={`${h} ${w} ${bg} rounded-full animate-bounce [animation-delay:-0.15s]`}
      ></span>
      <span className={`${h} ${w} ${bg} rounded-full animate-bounce`}></span>
    </span>
  );
}
