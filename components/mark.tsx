import * as React from 'react';


interface MarkProps extends React.ComponentProps<'p'> {
  mark: number
  abs?: boolean
}

export function Mark({
  mark,
  abs = false,
  className,
  ...props
}: MarkProps) {
  let color
  if (!abs) {
    if (mark < 2.5) color = 'text-rose-600';
    if (2.5 <= mark && mark < 3.5) color = 'text-red-500';
    if (3.5 <= mark && mark < 4.5) color = 'text-blue-500';
    if (4.5 <= mark) color = 'text-green-500';
  } else {
    if (mark >= 0) color = 'text-green-500';
    else color = 'text-red-500';
  }
  return (
    <p {...props} className={`${color} inline w-min ` + className}>{abs && mark > 0 && '+'}{mark}</p>
  )
}