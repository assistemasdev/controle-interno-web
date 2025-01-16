import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';

const CalendarPage = () => {
    const eventsService = createEventsServicePlugin();

    const eventModalPlugin = createEventModalPlugin({ eventsService });
    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: [
            {
                id: '1',
                title: 'Evento 1',
                start: '2025-01-15 10:00',  
                end: '2025-01-15 11:00',    
                description:"teste"
            },
        ],
        plugins: [eventsService, eventModalPlugin],
        locale: 'pt-BR', 
    });

    useEffect(() => {
        eventsService.getAll();
    }, []);

    return (
        <MainLayout>
            <div>
                <ScheduleXCalendar calendarApp={calendar} />
            </div>
        </MainLayout>
    );
};

export default CalendarPage;
