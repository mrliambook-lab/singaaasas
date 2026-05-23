import React from "react";
import { Signal, Wifi, Battery, Smartphone } from "lucide-react";

interface PhoneContainerProps {
  children: React.ReactNode;
  title?: string;
  onFocusClick?: () => void;
  isFocused?: boolean;
}

export default function PhoneContainer({
  children,
  title,
  onFocusClick,
  isFocused = false,
}: PhoneContainerProps) {
  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-500 ${
        isFocused ? "scale-100 z-10" : "scale-95 opacity-85 hover:opacity-100 cursor-pointer"
      }`}
      onClick={() => !isFocused && onFocusClick?.()}
    >
      {/* Dynamic Title for presentation */}
      {title && (
        <div className="mb-3 flex items-center gap-1.5 text-xs font-mono tracking-wider text-slate-500 uppercase">
          <Smartphone size={12} className="text-teal-500" />
          <span>{title}</span>
          {!isFocused && (
            <span className="text-[10px] bg-sky-100 text-sky-700 px-1 py-0.2 rounded font-sans ml-1">
              Tap to focus
            </span>
          )}
        </div>
      )}

      {/* Realistic device frame */}
      <div 
        id={`phone-frame-${title?.toLowerCase().replace(/\s/g, '-')}`}
        className={`relative w-[360px] h-[740px] rounded-[48px] border-[12px] border-slate-900 bg-white shadow-2xl overflow-hidden flex flex-col select-none transition-shadow ${
          isFocused ? "shadow-teal-100 shadow-2xl ring-4 ring-teal-400/20" : "hover:shadow-xl"
        }`}
      >
        {/* Notch - Dynamic Island Style */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-0.5"></div>
        </div>

        {/* Status Bar */}
        <div className="h-11 px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-slate-800 bg-slate-50/40 backdrop-blur-md z-40 select-none shrink-0">
          <span className="text-[11px] font-mono tracking-tight">09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal size={10} className="text-slate-800" />
            <Wifi size={10} className="text-slate-800" />
            <div className="flex items-center gap-1 bg-slate-200 pl-1 pr-0.5 py-0.4 rounded text-[9px] font-bold line-clamp-1 h-3.5">
              <span>85%</span>
              <Battery size={10} className="text-slate-800 fill-slate-800" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Area */}
        <div className="flex-1 w-full relative overflow-hidden flex flex-col bg-slate-50">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-4 w-full bg-transparent flex justify-center items-center z-40 relative bottom-0 shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full hover:bg-slate-400 transition-colors"></div>
        </div>
      </div>
    </div>
  );
}
