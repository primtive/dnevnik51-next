import * as React from 'react';
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
import { Mark } from '@/components/mark';

export const LessonCard = ({ name, rating }: { name: string, rating: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Оценка</TableCell>
              <TableCell className=''><Mark mark={rating.student.average} /> (<Mark abs={true} mark={rating.relative.average} /> от класса)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Кол-во оценок</TableCell>
              <TableCell className=''>{rating.student.count} (<Mark abs={true} mark={rating.relative.count} /> от класса)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
