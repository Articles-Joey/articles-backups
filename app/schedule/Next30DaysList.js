"use client"
import { useEffect, useMemo, useRef } from 'react';
import { format, addDays, addSeconds } from 'date-fns';
import { Typography } from '@mui/material';
import { useBackupTemplates } from '@/components/hooks/useBackupTemplates';

const Next30DaysList = () => {
    const today = useMemo(() => new Date(), []);
    const days = Array.from({ length: 30 }, (_, i) => addDays(today, i));

    // Ref to track which events have already been logged
    const loggedRef = useRef({});

    useEffect(() => {
        // Example array of future events
        const futureEvents = [
            { date: addSeconds(today, 1) },
            { date: addSeconds(today, 3) },
            { date: addSeconds(today, 7) },
            { date: addSeconds(today, 15) },
            { date: addSeconds(today, 29) },
        ];

        const interval = setInterval(() => {
            const now = new Date();
            futureEvents.forEach((event, idx) => {
                if (!loggedRef.current[idx] && event.date <= now) {
                    console.log(`Event at index ${idx} has passed:`, event.date);
                    loggedRef.current[idx] = true;
                }
            });
        }, 1000 * 10); // check every 10 seconds
        return () => clearInterval(interval);
    }, [today]);

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {days.map((date, index) => (
                <Day key={index} date={date} today={today} />
            ))}
        </ul>
    );
};

function Day({ date, today }) {
    // Helper: determine if a task is scheduled to run on a given date
    const isScheduledToday = (item, day) => {
        if (!item.schedule_frequency) return false;
        if (item.schedule_frequency === 'Daily') return true;
        if (item.schedule_frequency === 'Weekly') {
            return day.getDay() === today.getDay(); // Same weekday as today
        }
        if (item.schedule_frequency === 'Monthly') {
            return day.getDate() === today.getDate(); // Same day of month
        }
        // Add more logic for 'Custom' if needed
        return false;
    };

    const {
        templates,
        isLoading: templatesIsLoading,
        mutate: mutateTemplates
    } = useBackupTemplates();

    // Find templates scheduled for this day
    const scheduledToday = templates?.filter((item) => isScheduledToday(item, date));

    // For each scheduled template, get its time (default to 12:00 AM if missing)
    const scheduledTimes = scheduledToday?.map((item) => {
        let time = item.schedule_time || '00:00';
        // Format as 12-hour time with am/pm
        const [h, m] = time.split(":");
        const d = new Date(date);
        d.setHours(Number(h), Number(m), 0, 0);
        return `${item.name} (${format(d, 'hh:mma')})`;
    });

    return (
        <li className='day' style={{ marginBottom: '0.5rem' }}>
            <div>{format(date, 'eeee, MMMM d, yyyy')}</div>
            <Typography color='primary' sx={{ marginLeft: '0.5rem' }}>
                {scheduledToday.length > 0
                    ? `${scheduledToday.length} scheduled: ${scheduledTimes.join(', ')}`
                    : '0 scheduled'}
            </Typography>
        </li>
    );
}

export default Next30DaysList;
