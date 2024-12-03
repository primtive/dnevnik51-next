import * as React from 'react';


interface PositionNumProps extends React.ComponentProps<'p'> {
  num: number;
}

export function PositionNum({
  num,
  className,
  ...props
}: PositionNumProps) {
  let color
  if (num == 1) color = '-webkit-linear-gradient(transparent, transparent), -webkit-linear-gradient(230deg, #FFD700 0%, #DCAC06 100%)';
  if (num == 2) color = '-webkit-linear-gradient(transparent, transparent), -webkit-linear-gradient(0deg, #C0C0C0 0%, #A9A9A9 100%)';
  if (num == 3) color = '-webkit-linear-gradient(transparent, transparent), -webkit-linear-gradient(0deg, #cd7f32 0%, #b1560f 100%)';
  return (
    <p {...props} style={color ? { background: color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}} className={'inline ' + className}>{num}</p>
  )
}