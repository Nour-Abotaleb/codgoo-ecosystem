import type { DashboardTokens } from "../../types";

type ScheduleViewProps = {
  readonly tokens: DashboardTokens;
};

export const ScheduleView = ({ tokens }: ScheduleViewProps) => {
  return (
    <div className={`${tokens.cardBase} rounded-[20px] p-10`}>
      <h2 className={`text-2xl font-semibold ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>
        Schedule
      </h2>
      <div className="flex items-center justify-center h-96 mt-6">
        <div className="text-center">
          <p className={`text-6xl font-bold mb-4`} style={{ color: '#FE572A' }}>
            تحت الإنشاء
          </p>
          <p className={`text-lg ${tokens.isDark ? 'text-white/70' : 'text-[#A3AED0]'}`}>
            This section is under construction
          </p>
        </div>
      </div>
    </div>
  );
};
