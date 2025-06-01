"use client"
import React from 'react';
import { format, addDays } from 'date-fns';
import { Typography } from '@mui/material';
import { useBackupTemplates } from '@/components/hooks/useBackupTemplates';

const Next30DaysList = () => {
    const today = new Date();
    const days = Array.from({ length: 30 }, (_, i) => addDays(today, i));

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
        if (!item.schedule) return false;
        if (item.schedule_frequency === 'Daily') return true;
        if (item.schedule_frequency === 'Weekly') {
            return day.getDay() === today.getDay(); // Same weekday as today
        }
        return false;
    };

    const {
        templates,
        isLoading: templatesIsLoading,
        // isError,
        mutate: mutateTemplates
    } = useBackupTemplates();

    const scheduledToday = templates?.filter((item) => isScheduledToday(item, date));

    return (
        <li
            className='day'
            style={{
                marginBottom: '0.5rem',
            }}
        >
            <div>{format(date, 'eeee, MMMM d, yyyy')}</div>
            <Typography
                color='primary'
                sx={{
                    marginLeft: '0.5rem',
                }}
            >
                {scheduledToday.length > 0
                    ? `${scheduledToday.length} scheduled: ${scheduledToday.map((i) => i.name).join(', ')}`
                    : '0 scheduled'}
            </Typography>
        </li>
    );
}

export default Next30DaysList;
