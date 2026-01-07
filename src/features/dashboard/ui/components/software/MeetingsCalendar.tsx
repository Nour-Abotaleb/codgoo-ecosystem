// @ts-expect-error - react-big-calendar doesn't have types
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { DashboardTokens } from '../../types';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type MeetingEvent = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    project: string;
    meeting_name: string;
  };
};

type MeetingsCalendarProps = {
  readonly meetings: Array<{
    meeting_name: string;
    date: string;
    start: string;
    end: string;
    project: string;
  }>;
  readonly tokens: DashboardTokens;
};

export const MeetingsCalendar = ({ meetings, tokens }: MeetingsCalendarProps) => {
  // Transform meetings data to calendar events
  const events: MeetingEvent[] = meetings.map((meeting, index) => {
    const [startHours, startMinutes] = meeting.start.split(':');
    const [endHours, endMinutes] = meeting.end.split(':');
    
    const start = new Date(meeting.date);
    start.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    
    const end = new Date(meeting.date);
    end.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    return {
      id: index,
      title: meeting.meeting_name,
      start,
      end,
      resource: {
        project: meeting.project,
        meeting_name: meeting.meeting_name,
      },
    };
  });

  const cardColors = [
    { bg: '#FFFAED', text: '#2B3674' },
    { bg: '#F4F4F4', text: '#2B3674' },
    { bg: '#000000', text: '#FFFFFF' },
  ];

  const eventStyleGetter = (_event: MeetingEvent, index: number) => {
    const colorIndex = (index || 0) % cardColors.length;
    const colors = cardColors[colorIndex];

    return {
      style: {
        backgroundColor: colors.bg,
        borderRadius: '12px',
        opacity: 0.9,
        color: colors.text,
        border: `1px solid ${colors.bg}`,
        display: 'block',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 500,
      },
    };
  };

  const customStyles = `
    .rbc-calendar {
      font-family: inherit;
      height: 100%;
    }
    
    .rbc-header {
      padding: 12px 4px;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 2px solid ${tokens.isDark ? 'rgba(255,255,255,0.1)' : '#E6E9FB'};
    }
    
    .rbc-today {
      background-color: ${tokens.isDark ? 'rgba(255,255,255,0.02)' : '#F9FBFD'};
    }
    
    .rbc-off-range-bg {
      background-color: ${tokens.isDark ? 'rgba(0,0,0,0.1)' : '#F9FBFD'};
    }
    
    .rbc-event {
      padding: 4px 6px;
      font-size: 11px;
    }
    
    .rbc-event-label {
      font-size: 11px;
    }
    
    .rbc-time-slot {
      background-color: ${tokens.isDark ? 'transparent' : '#FFFFFF'};
    }
    
    .rbc-time-content {
      border-color: ${tokens.isDark ? 'rgba(255,255,255,0.05)' : '#E6E9FB'};
    }
    
    .rbc-current-time-indicator {
      background-color: #0F6773;
      height: 2px;
    }
    
    .rbc-toolbar {
      padding: 12px 0;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .rbc-toolbar button {
      color: ${tokens.isDark ? '#FFFFFF' : '#2B3674'};
      background-color: ${tokens.isDark ? 'rgba(255,255,255,0.1)' : '#F9FBFD'};
      border: 1px solid ${tokens.isDark ? 'rgba(255,255,255,0.2)' : '#E6E9FB'};
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .rbc-toolbar button:hover {
      background-color: ${tokens.isDark ? 'rgba(255,255,255,0.2)' : '#E6E9FB'};
    }
    
    .rbc-toolbar button.rbc-active {
      background-color: #0F6773;
      color: white;
      border-color: #0F6773;
    }
    
    .rbc-toolbar-label {
      color: ${tokens.isDark ? '#FFFFFF' : '#2B3674'};
      font-weight: 600;
      font-size: 14px;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div style={{ height: '100%', width: '100%' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view="week"
          views={['month', 'week', 'day']}
          defaultView="week"
          eventPropGetter={eventStyleGetter}
          popup
          selectable
        />
      </div>
    </>
  );
};
