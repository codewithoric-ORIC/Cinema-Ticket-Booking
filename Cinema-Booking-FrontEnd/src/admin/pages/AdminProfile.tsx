import { getLogeedInUsername, getRoleName, getUser } from "../../auth/service/AuthService";
import { IoPersonCircleOutline } from "react-icons/io5";
import AdminBadge from "../components/AdminBadge";

function AdminProfile() {
  const username = getLogeedInUsername();
  const role = getRoleName();
  const user = getUser();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <AdminBadge text="Admin Profile" />
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-3">Profile</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">View your admin profile.</p>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)]">
            <IoPersonCircleOutline className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{username}</h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50/80 px-3 py-1 rounded-full mt-1.5 inline-block">
              {role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/50 p-4 border border-white/40">
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">Email</label>
            <p className="text-slate-800 text-sm font-medium">{user?.email || '-'}</p>
          </div>
          <div className="rounded-xl bg-white/50 p-4 border border-white/40">
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">Phone</label>
            <p className="text-slate-800 text-sm font-medium">{user?.phone || user?.phoneNumber || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
