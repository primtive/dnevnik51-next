import * as React from 'react';
import { MarksComponent } from './marks';

export const metadata = {
  title: 'Оценки',
};

export default async function Marks() {
  const now: Date = new Date();
  const start: Date = new Date(now.getFullYear(), 0, 0);
  var day = Math.floor((now.valueOf() - start.valueOf()) / (1000 * 60 * 60 * 24));

  var initPeriod = '';
  var grade = 10;

  if (grade >= 10) {
    if (244 < day || day < 10) initPeriod = 'h1';
    else initPeriod = 'h2';
  } else {
    if (244 < day || day < 311) initPeriod = 'q1';
    else if (311 < day || day < 10) initPeriod = 'q2';
    else if (10 < day && day < 94) initPeriod = 'q3';
    else if (94 < day && day < 244) initPeriod = 'q4';
  }
  return (
    <MarksComponent initPeriod={initPeriod}/>
  );
}