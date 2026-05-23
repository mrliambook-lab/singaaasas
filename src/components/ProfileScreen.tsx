import { useState } from "react";
import { User, Sparkles, Award, Star, History, Bell, Shield, Moon, Sun, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { UserProfile } from "../types";

interface ProfileScreenProps {
  user: UserProfile;
  onChangeName: (newName: string) => void;
  onLogoutSimulated: () => void;
}

export default function ProfileScreen({
  user,
  onChangeName,
  onLogoutSimulated,
}: ProfileScreenProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNameVal, setNewNameVal] = useState(user.name);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Stats goals simulated data
  const calendarDays = [
    { day: "M", active: true },
    { day: "T", active: true },
    { day: "W", active: true },
    { day: "T", active: true },
    { day: "F", active: true },
    { day: "S", active: false },
    { day: "S", active: false }
  ];

  const handleUpdateName = () => {
    if (newNameVal.trim()) {
      onChangeName(newNameVal.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/60 p-4 pb-20 overflow-y-auto scrollbar-hide select-none animate-fadeIn">
      
      {/* Profile Card & Avatar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm text-center mb-5 shrink-0 select-none">
        <div className="relative w-18 h-18 mx-auto mb-2.5">
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full border-2 border-teal-500/80 p-0.5"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow border border-white">
            ★
          </div>
        </div>

        {/* Change Name or Input */}
        {isEditingName ? (
          <div className="flex gap-1.5 justify-center items-center mt-1">
            <input
              type="text"
              value={newNameVal}
              onChange={(e) => setNewNameVal(e.target.value)}
              className="border border-slate-200 rounded px-2 py-0.5 text-xs font-bold text-center outline-none max-w-[120px]"
            />
            <button
              onClick={handleUpdateName}
              className="text-[9.5px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-1.5 mt-1 cursor-pointer" onClick={() => setIsEditingName(true)}>
            <h2 className="text-[14px] font-extrabold text-slate-800 leading-none">{user.name}</h2>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded hover:bg-slate-200">Edit</span>
          </div>
        )}

        <p className="text-[9px] text-slate-400 font-mono mt-1.5">{user.email}</p>

        {/* Membership details */}
        <div className="mt-3 inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-800 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase">
          <Award size={10} />
          <span>{user.membership} Tier</span>
        </div>
      </div>

      {/* Stats Widgets Bento Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 shrink-0 text-slate-800">
        
        {/* Streak Counter Widget */}
        <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8.5px] font-mono text-slate-400 uppercase">Daily Streak</span>
            <Sparkles size={11} className="text-teal-500 animate-pulse" />
          </div>
          <h3 className="text-[18px] font-extrabold text-slate-800 leading-tight">{user.stats.dailyStreak} Days</h3>
          
          {/* Calendar Dots */}
          <div className="flex gap-1.5 mt-2.5">
            {calendarDays.map((cal, idx) => (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <span className="text-[7.5px] text-slate-400 font-mono font-bold leading-none">{cal.day}</span>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                  cal.active ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {cal.active ? "✓" : "•"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minutes Read Widget */}
        <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8.5px] font-mono text-slate-400 uppercase">Weekly Time</span>
            <History size={11} className="text-teal-500" />
          </div>
          <h3 className="text-[18px] font-extrabold text-slate-800 leading-tight">{user.stats.minutesReadThisWeek} min</h3>
          <p className="text-[9px] text-slate-400 font-medium mt-1">Goal: 300 minutes</p>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(user.stats.minutesReadThisWeek / 300) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Account Settings List */}
      <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-sm shrink-0 mb-4 select-none text-slate-800">
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-2 px-1">Settings Menu</span>
        
        <div className="space-y-1">
          {/* Reminders Toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Bell size={13} />
              </div>
              <span className="text-[10.5px] font-bold">Daily Reading Alerts</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center ${
                notificationsEnabled ? "bg-teal-600 justify-end" : "bg-slate-200 justify-start"
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm mx-0.5"></div>
            </button>
          </div>

          {/* Secure lock account */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Shield size={13} />
              </div>
              <span className="text-[10.5px] font-bold">Biometric Account Sync</span>
            </div>
            <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase mr-1">Firebase Sync</span>
          </div>

          {/* Help Center */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center">
                <HelpCircle size={13} />
              </div>
              <span className="text-[10.5px] font-bold">Support & FAQ</span>
            </div>
            <ChevronRight size={12} className="text-slate-400 mr-1" />
          </div>

          {/* Logout state */}
          <div 
            onClick={onLogoutSimulated}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-rose-50/50 cursor-pointer text-rose-600"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center">
                <LogOut size={13} />
              </div>
              <span className="text-[10.5px] font-bold">Disconnect Profile</span>
            </div>
            <span className="text-[8px] font-semibold tracking-wider text-rose-400 uppercase mr-1">Exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
