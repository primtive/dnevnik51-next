import * as React from 'react';
import { DiaryComponent } from "./diary";

export const metadata = {
  title: 'Дневник',
};

export default function Home() {
  return (
    <DiaryComponent />
  );
}