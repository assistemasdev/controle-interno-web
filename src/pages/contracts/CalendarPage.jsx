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
import useBaseService from "../../hooks/services/useBaseService";
import { useNavigate } from "react-router-dom";
import { entities } from "../../constants/entities";
import useLoader from "../../hooks/useLoader";

const CalendarPage = () => {
    const navigate = useNavigate();
    const { fetchAll } = useBaseService(entities.contracts,navigate);
    const { showLoader, hideLoader } = useLoader();
    const [contracts, setContracts] = useState([]);
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

    const fetchContracts = async () => {
        try {
            showLoader();
            const response = await fetchAll();
            console.log(response)
        } catch (error) {
            console.log(error);
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchContracts();
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
