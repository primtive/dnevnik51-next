"use client"
import { useState, useEffect } from 'react'
import WeekSelect from "@/components/week-select";
// import reactStringReplace from "react-string-replace";
import moment from 'moment';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton';
import { Mark } from '@/components/mark';
import { Checkbox } from '@/components/ui/checkbox';

moment.locale('ru')

export const DiaryComponent = () => {
  const [diary, setDiary] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(moment().startOf('isoWeek').toDate());
  const [showTopics, setShowTopics] = useState(false);

  useEffect(() => {
    fetch('/api/edu/diary?date=' + moment(date).format('DD.MM.YYYY'))
      .then((res) => res.json())
      .then((json) => {
        setDiary(json.data)
        setLoading(false)
      })
  }, [date]);

  return (
    <>
      <div className='flex'>
        <WeekSelect onChange={(day: Date) => setDate(day)} />
        <div className="flex items-center space-x-2 ml-2 lg:ml-5">
          <Checkbox id="terms" onCheckedChange={(checked: any) => setShowTopics(checked)} />
          <label htmlFor="terms" className="text-sm font-medium leading-none">
            Темы
          </label>
        </div>
      </div>
      <div className='mt-5 grid gap-5 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
        {isLoading ?
          [...Array(5).keys()].map(x => <Skeleton key={x} className='w-[400px] h-[50px]' />)
          :
          diary.map((day: any) =>
            <Card key={day.name} className='min-w-[380px] max-w-[1000px]'>
              <CardHeader className='pb-3 md:pb-0'>
                <CardTitle>
                  <div className='flex'>
                    <p>{day.name}</p>
                    <p className='text-right ml-auto text-sm'>{day.date}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2 md:p-3'>
                <Table>
                  <TableBody>
                    {day.lessons.map((lesson: any) => (
                      <TableRow key={lesson.name}>
                        <TableCell>
                          <div className='inline'>
                            <div className='flex items-center'>
                              <p className="font-medium mr-2">{lesson.number} {lesson.subject}</p>
                              <p className='text-xs text-muted-foreground'>{lesson.time}</p>
                            </div>
                            {showTopics && <p className='text-xs text-muted-foreground'>{lesson.topic}</p>}
                            {lesson.homework && <p className='mt-1' dangerouslySetInnerHTML={{ __html: lesson.homework.length > 200 ? '<details><summary>Развернуть</summary>' + lesson.homework + '</details>' : lesson.homework }} />}
                            {lesson.note && <p className='italic'>{lesson.note}</p>}
                          </div>
                        </TableCell>
                        <TableCell className='text-right w-[50px]'>{lesson.mark && <Mark mark={lesson.mark} className='mr-0 ml-auto' />} {lesson.absence && 'н'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        }
      </div>
    </>
  )
}
