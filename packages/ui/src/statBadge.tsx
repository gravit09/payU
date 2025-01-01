"use client";

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function StatBadge({ icon, label, value }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary">
      {icon}
      <div className="flex gap-2 text-sm">
        <span className="font-semibold">{value}</span>
        <span className="text-primary/70">{label}</span>
      </div>
    </div>
  );
}
