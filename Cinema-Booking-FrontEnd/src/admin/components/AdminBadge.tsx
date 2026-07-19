interface AdminBadgeProps {
  text: string;
}

function AdminBadge({ text }: AdminBadgeProps) {
  return (
    <div className="inline-flex items-center self-start px-4 py-1.5 rounded-full
                bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md mb-3">
      <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
        {text}
      </span>
    </div>
  );
}

export default AdminBadge;
