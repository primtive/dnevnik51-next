"use client"

import moment from 'moment';
// import 'moment/locale/ru'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from 'date-fns';
import { ru } from "date-fns/locale/ru";
import * as React from 'react';
import {
  Button
} from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function getWeekDays(weekStart: Date) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

type week_range = {
  from: any,
  to: any
}

function getWeekRange(date: Date) {
  const startDay = 1;
  const weekStart = new Date(date.valueOf() - (date.getDay() <= 0 ? 7 - startDay : date.getDay() - startDay) * 86400000);
  return {
    from: weekStart,
    to: new Date(weekStart.valueOf() + 6 * 86400000)
  }
}

interface WeekSelectProps {
  onChange: any
}

interface WeekSelectState {
  hoverRange: week_range,
  selectedDays: any,
}

// moment.locale('ru')

class WeekSelect extends React.Component<WeekSelectProps, WeekSelectState> {


  constructor(props: WeekSelectProps) {
    super(props);
    this.state = {
      hoverRange: { from: null, to: null },
      selectedDays: getWeekDays(getWeekRange(new Date()).from),
    };
  }

  setDate = (date: Date) => {
    const old = this.state.selectedDays[0];
    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from),
    });
    if (old.getTime() != getWeekRange(date).from.getTime()) this.props.onChange(getWeekRange(date).from);
  }

  handleDayChange = (date: Date) => {
    this.setDate(date);
  };

  nextWeek = () => {
    this.setDate(moment(this.state.selectedDays[0]).add(7, 'd').toDate());
  }

  prevWeek = () => {
    this.setDate(moment(this.state.selectedDays[0]).add(-7, 'd').toDate());
  }

  render() {
    const { hoverRange, selectedDays } = this.state;

    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6],
    };
    return (
      <div className='flex space-x-2'>
        <Button variant="outline" className='w-8' onClick={this.prevWeek}><ArrowLeft /></Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className='min-w-[180px]'>
              <p className='leading-none overflow-hidden max-w-[120px] text-ellipsis'>
                {format(modifiers.selectedRangeStart, 'd MMM', { locale: ru }).slice(0, -1) + ' - ' + format(modifiers.selectedRangeEnd, 'd MMM', { locale: ru }).slice(0, -1)}
              </p>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0" align="center">
            <Calendar
              locale={ru}
              className="rounded-md border"
              selected={selectedDays}
              showOutsideDays
              modifiers={modifiers}
              onDayClick={this.handleDayChange}
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" className='w-8' onClick={this.nextWeek}><ArrowRight /></Button>
      </div>
    )
  }
}

export default WeekSelect;
