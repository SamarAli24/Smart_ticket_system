interface UserAvatarProps {
  name: string;
  size?: "sm" | "md";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserAvatar({ name, size = "sm" }: UserAvatarProps) {
  const sizeClasses = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return (
    <div
      className={`flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-ink-900 font-semibold text-white`}
    >
      {getInitials(name)}
    </div>
  );
}
