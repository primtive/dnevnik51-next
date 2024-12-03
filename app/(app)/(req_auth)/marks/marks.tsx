"use client"
import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton'
import { Mark } from '@/components/mark'

const periodNames: Record<string, string> = {
  q1: 'за 1 четверть',
  q2: 'за 2 четверть',
  q3: 'за 3 четверть',
  q4: 'за 4 четверть',
  h1: 'за 1 полугодие',
  h2: 'за 2 полугодие',
  year: 'за год'
}

export const MarksComponent = ({ initPeriod }: { initPeriod: string }) => {
  const [period, setPeriod] = useState(initPeriod);
  const [marksMode, setMarksMode] = useState('pm');
  const [isLoading, setLoading] = useState(true)
  const [marks, setMarks] = useState<any>(null)

  useEffect(() => {
    fetch('/api/edu/marks?period=' + period + '&marks_mode=' + marksMode)
      .then((res) => res.json())
      .then((json) => {
        setMarks(json.data)
        setLoading(false)
      })
  }, [period, marksMode]);

  return (
    <div className='space-y-3'>
      <div className='flex space-x-3'>
        <Select defaultValue={period} onValueChange={(value) => { setPeriod(value) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Период</SelectLabel>
              <SelectItem value="q1">1 четверть</SelectItem>
              <SelectItem value="q2">2 четверть</SelectItem>
              <SelectItem value="q3">3 четверть</SelectItem>
              <SelectItem value="q4">4 четверть</SelectItem>
              <SelectItem value="h1">1 полугодие</SelectItem>
              <SelectItem value="h2">2 полугодие</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue={marksMode} onValueChange={(value) => { setMarksMode(value) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип оценок" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Оценки</SelectLabel>
              <SelectItem value="pm">Обычные</SelectItem>
              <SelectItem value="fm">Итоговые</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle>Оценки</CardTitle>
          {/* <CardDescription>Сформированная</CardDescription> */}
        </CardHeader>
        <CardContent>
          {isLoading ?
            <Skeleton className='w-[100px] h-[20px]' /> :
            marks!.mode == 'pm' ?
              <Table>
                <TableCaption>Оценки {periodNames[period]}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Предмет</TableHead>
                    <TableHead className='min-w-[200px]'>Оценки</TableHead>
                    <TableHead className="w-[50px]">Средняя</TableHead>
                    <TableHead className="w-[50px] text-right">н-ки</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks!.subjects.map((subject: any) => (
                    <TableRow key={subject.name}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell className='flex gap-2 flex-wrap'>{subject.marks.map((x: number, i: number) => <Mark mark={x} key={i} />)}</TableCell>
                      <TableCell><Mark mark={subject.average} /></TableCell>
                      <TableCell className="text-right">{subject.skips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              :
              <Table>
                <TableCaption>Годовые оценки</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Предмет</TableHead>
                    <TableHead className="w-[50px]">1</TableHead>
                    <TableHead className="w-[50px]">2</TableHead>
                    <TableHead className="w-[50px]">3</TableHead>
                    <TableHead className="w-[50px]">4</TableHead>
                    <TableHead className="w-[50px]">Год</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks!.subjects.map((subject: any) => (
                    <TableRow key={subject.name}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell><Mark mark={subject.q1} /></TableCell>
                      <TableCell><Mark mark={subject.q2} /></TableCell>
                      <TableCell><Mark mark={subject.q3} /></TableCell>
                      <TableCell><Mark mark={subject.q4} /></TableCell>
                      <TableCell><Mark mark={subject.year} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>}
        </CardContent>
      </Card>
    </div>
  );
}
