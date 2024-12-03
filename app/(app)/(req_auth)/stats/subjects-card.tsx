"use client"
import { Mark } from "@/components/mark";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import * as React from 'react';

export const SubjectsCard = ({ stats }: { stats: any }) => {
  const [showCount, setShowCount] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Статистика по предметам
          <div className="flex items-center space-x-2 ml-auto float-right">
            <Checkbox id="terms" onCheckedChange={(checked: any) => setShowCount(checked)} />
            <label htmlFor="terms" className="text-sm font-medium leading-none">
              Кол-во
            </label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {/*<TableCaption>Статистика</TableCaption>*/}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Предмет</TableHead>
              <TableHead className='w-[60px]'>Класс</TableHead>
              <TableHead className="w-[60px]">Вы</TableHead>
              <TableHead className="w-[60px] text-right">Разница</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(stats.ratings).map(([name, rating]: Array<any>) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                {showCount ?
                  <>
                    <TableCell>{rating.grade.count}</TableCell>
                    <TableCell>{rating.student.count}</TableCell>
                    <TableCell className="text-right"><Mark abs={true} mark={rating.relative.count} /></TableCell>
                  </>
                  :
                  <>
                    <TableCell><Mark mark={rating.grade.average} /></TableCell>
                    <TableCell><Mark mark={rating.student.average} /></TableCell>
                    <TableCell className="text-right"><Mark abs={true} mark={rating.relative.average} /></TableCell>
                  </>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
