import FullCalendar from '@fullcalendar/react'
import {
  DateSelectArg,
  EventContentArg,
  EventSourceInput
} from '@fullcalendar/core'

import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import React from 'react'
import { Button, Tooltip } from '@fluentui/react-components'
import {
  CalendarAgendaRegular,
  CalendarMonthRegular,
  CalendarTodayRegular,
  CalendarWorkWeekRegular,
  ChevronLeftFilled,
  ChevronRightFilled
} from '@fluentui/react-icons'
import { format } from '@/lib/dayjs'
import { cn } from '@/utils'
import { EventImpl } from '@fullcalendar/core/internal'

type Views =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek'
  | 'today'

const buttonsViews = {
  dayGridMonth: {
    icon: CalendarMonthRegular,
    text: 'Mes'
  },
  timeGridWeek: {
    icon: CalendarWorkWeekRegular,
    text: 'Semana'
  },
  timeGridDay: {
    icon: CalendarAgendaRegular,
    text: 'Día'
  },
  today: {
    icon: CalendarTodayRegular,
    text: 'Hoy'
  }
}

type ScheduleCalendarProps = {
  nav?: React.ReactNode
  header?: React.ReactNode
  footerFLoat?: React.ReactNode
  className?: string
  defaultView?: Views
  onDateSelect?: (selectInfo: DateSelectArg) => void
  events?: EventSourceInput
  onEventClick?: (event: EventImpl) => void
  focusDate?: Date
  highlightEventId?: string
}

export default function Calendar({
  nav,
  className,
  defaultView = 'dayGridMonth',
  onDateSelect = () => {},
  header,
  events = [],
  footerFLoat,
  onEventClick = () => {},
  focusDate,
  highlightEventId
}: ScheduleCalendarProps) {
  const calendarRef = React.useRef<FullCalendar>(null)
  const [view, setView] = React.useState<Views>(defaultView)
  const [title, setTitle] = React.useState<string>('')

  React.useEffect(() => {
    updateTitle()
  }, [])

  const updateTitle = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      setTitle(format(calendarApi.getDate(), 'MMMM YYYY'))
    }
  }

  const handleViewChange = (newView: Views) => {
    if (newView === 'today') {
      calendarRef.current?.getApi().today()
      updateTitle()
      return
    }
    setView(newView)
    calendarRef.current?.getApi().changeView(newView)
    updateTitle()
  }

  const handleNext = () => {
    calendarRef.current?.getApi().next()
    updateTitle()
  }

  const handlePrev = () => {
    calendarRef.current?.getApi().prev()
    updateTitle()
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect()
    onDateSelect(selectInfo)
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      calendarRef.current?.getApi().updateSize()
    }, 10)
    setTimeout(() => clearInterval(interval), 300)
  }, [])

  React.useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.removeAllEvents()
      calendarApi.addEventSource(events)
    }
  }, [events])

  React.useEffect(() => {
    if (focusDate) {
      calendarRef.current?.getApi().gotoDate(focusDate)
      updateTitle()
    }
  }, [focusDate])

  return (
    <div
      className={cn(
        'overflow-auto relative border dark:border-transparent bg-white dark:bg-black/40 rounded-lg w-full flex flex-col grow',
        className
      )}
    >
      {header && header}
      <header className="flex relative justify-between gap-3 items-center p-2 pb-px pt-0">
        <nav className="flex basis-0 py-2 grow">{nav}</nav>
        <nav className="flex items-center gap-2">
          <h2 className="capitalize text-xl font-normal">
            <span className="font-bold">{title.split(' ')[0]} </span>
            {title.split(' ')[1]}
          </h2>
        </nav>
        <nav className="flex items-center basis-0 gap-1 grow justify-end">
          {Object.entries(buttonsViews).map(([key, item]) => (
            <button
              key={key}
              data-current={view === key ? '' : undefined}
              onClick={() => handleViewChange(key as Views)}
              className="data-[current]:!bg-blue-500 data-[current]:!text-white bg-stone-500/10 dark:bg-stone-500/20 hover:bg-stone-500/20 dark:hover:bg-stone-500/30 rounded-md p-1 px-2 hover:dark:text-stone-200 border dark:text-stone-300 flex text-sm"
            >
              <p>{item.text}</p>
            </button>
          ))}
          <Button
            onClick={handlePrev}
            appearance="transparent"
            icon={<ChevronLeftFilled />}
          />
          <Button
            appearance="transparent"
            onClick={handleNext}
            icon={<ChevronRightFilled />}
          />
        </nav>
      </header>
      <div className="flex relative w-full grow gap-2 overflow-auto">
        <FullCalendar
          ref={calendarRef}
          editable={false}
          locale={'es-US'}
          selectable
          selectMirror
          now={new Date()}
          eventDidMount={(info) => {
            if (info.event.id === highlightEventId) {
              info.el.classList.add(
                'outline',
                'outline-2',
                'outline-yellow-500'
              )
            }
          }}
          dayHeaderFormat={{
            weekday: 'short',
            day:
              view === 'timeGridDay' || view === 'timeGridWeek'
                ? 'numeric'
                : undefined
          }}
          slotMinTime="06:00:00"
          slotMaxTime="23:15:00"
          slotDuration="00:30:00"
          slotLabelInterval={{ minutes: 30 }}
          slotLabelClassNames={['text-xs', 'opacity-70']}
          nowIndicator
          hiddenDays={[0]}
          headerToolbar={false}
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin
          ]}
          eventClassNames={'bg-[#3788d8]'}
          initialView={view}
          allDayClassNames={['text-xs', 'opacity-70']}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={(info) => {
            onEventClick(info.event)
          }}
        />
      </div>
      {footerFLoat && (
        <div className="absolute bottom-2 z-[1] left-16 dark:bg-[#2f2e2b] bg-white p-2 py-1 rounded-md shadow-lg dark:shadow-black/40">
          {footerFLoat}
        </div>
      )}
    </div>
  )
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <Tooltip
      withArrow
      content={
        <div className="flex flex-col gap-px">
          <p className="text-sm">{eventInfo.event.title}</p>
          <p className="text-xs">
            <span className="opacity-60">Hora: </span>
            {format(eventInfo.event.start, 'h:mm A')} -{' '}
            {format(eventInfo.event.end, 'h:mm A')}
          </p>
          <div className="flex flex-col gap-1">
            {Object.entries(eventInfo.event.extendedProps)
              .filter(([key]) => !key.startsWith('$'))
              .map(([key, value]) => (
                <div className="text-xs">
                  <span className="opacity-60">{key}: </span>
                  <span className="">{value}</span>
                </div>
              ))}
          </div>
        </div>
      }
      relationship="description"
    >
      <div className="h-full flex flex-col">
        <p className="font-medium px-1 pt-1 text-nowrap text-xs leading-4 text-ellipsis overflow-hidden">
          {eventInfo.event.title}
        </p>
        <p className="text-[11px] opacity-80 px-1 text-ellipsis text-nowrap overflow-hidden">
          {format(eventInfo.event.start, 'h:mm A')} -{' '}
          {format(eventInfo.event.end, 'h:mm A')}
        </p>
        {eventInfo.event.extendedProps.$img ? (
          <div className="m-1 size-5 mt-auto p-0.5 aspect-square grid place-content-center bg-white rounded-full w-fit">
            <img
              className="max-w-full"
              src={eventInfo.event.extendedProps.$img}
              alt="Business unit logo"
            />
          </div>
        ) : (
          eventInfo.event.extendedProps.$icon && (
            <div className="mt-auto text-xl px-1 pb-1">
              {eventInfo.event.extendedProps.$icon}
            </div>
          )
        )}
      </div>
    </Tooltip>
  )
}
