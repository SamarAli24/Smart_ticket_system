interface UserAvatarProps {
  name: string;
  size?: "sm" | "md";
}

const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-fuchsia-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function UserAvatar({ name, size = "sm" }: UserAvatarProps) {
  const sizeClasses = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return (
    <div
      className={`flex ${sizeClasses} ${getAvatarColor(name)} shrink-0 items-center justify-center rounded-full font-semibold text-white`}
    >
      {getInitials(name)}
    </div>
  );
}
