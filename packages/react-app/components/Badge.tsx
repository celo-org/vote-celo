type Props = {
  value: string;
  className?: string;
};

function Badge({ value, className }: Props) {
  return (
    <span
      className={`bg-blue-100 text-blue-800 font-light text-xs mr-2 px-2.5 py-0.5 rounded-full  ${className}`}
    >
      {value}
    </span>
  );
}

export default Badge;
