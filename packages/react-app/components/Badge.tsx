type Props = {
  value: string;
  className?: string;
};

function Badge({ value, className }: Props) {
  return (
    <span
      className={`bg-black text-white text-xs font-medium mr-2 px-1 py-0.5 rounded ${className}`}
    >
      {value}
    </span>
  );
}

export default Badge;
