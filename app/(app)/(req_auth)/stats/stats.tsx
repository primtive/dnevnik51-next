import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStats } from '@/data/stats';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PositionNum } from '@/components/position-number';
import { Mark } from '@/components/mark';
import moment from 'moment';
import 'moment/locale/ru';
import { LessonCard } from './lesson-card';
import { SubjectsCard } from './subjects-card';

moment.locale('ru')

export async function StatsComponent() {
  const session = await getServerSession(authOptions)
  const stats = await getStats(session?.user!.sid, session?.user!.gid)
  const last_update = moment(stats.lastUpdate);

  return <div className='grid grid-cols-1 md:grid-cols-2 w-fit gap-5'>
    <div className='space-y-5'>
      <SubjectsCard stats={stats} />
    </div>
    <div className='space-y-5'>
      <Card>
        <CardHeader>
          <CardTitle>
            Вы <PositionNum num={stats.positionAverage} />-й в классе по оценкам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>Рейтинг: {stats.averageRating}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Вы <PositionNum num={stats.positionCount} />-й в классе по количеству оценок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>Рейтинг: {stats.countRating}</p>
        </CardContent>
      </Card>
      <LessonCard name={'Лучший урок: ' + stats.best[0]} rating={stats.best[1]} />
      <LessonCard name={'Худший урок: ' + stats.worst[0]} rating={stats.worst[1]} />
      <Card>
        <CardHeader>
          <CardTitle>
            Последнее обновление: {last_update.format('D MMM').slice(0, -1)}, {last_update.startOf('hour').fromNow()}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  </div>
}
