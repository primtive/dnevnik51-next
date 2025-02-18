import headers from "@/config/config"
import { parse } from 'node-html-parser';
import moment from "moment";

const call_shedule = [
  '8:30 - 9:10',
  '9:20 - 10:00',
  '10:15 - 10:55',
  '11:10 - 11:50',
  '12:05 - 12:45',
  '12:55 - 13:35',
  '13:40 - 14:20']

const periods = {
  'q1': ['01.09', '28.10'],  // first
  'q2': ['07.11', '30.12'],  // second
  'q3': ['01.01', '24.03'],  // third
  'q4': ['04.04', '31.05'],  // fourth
  'h1': ['01.09', '30.12'],  // first half
  'h2': ['01.01', '31.05'],  // second half
  'year': ['01.09', '31.05'] // year
}

const subject_names = [
  ['Обеспечение безопасности жизнедеятельности', 'ОБЖ'],
  ['Иностранный язык (английский)', 'Английский язык'],
  ['История России. Всеобщая история', 'История'],
  ['Изобразительное искусство', 'ИЗО'],
  ['Физическая культура (девушки)', 'Физ-ра'],
  ['Физическая культура (юноши)', 'Физ-ра'],
  ['Физическая культура', 'Физ-ра'],
  ['Родная литература (русская)', 'Родная литература'],
  ['Родной язык (русский)', 'Родной язык'],
  ['Элективный курс по русскому языку', 'ЭК русский'],
  ['Этика и психология', 'Психология'],
  ['Тождественные преобразования', 'Тождества'],
  ['Вероятность и статистика', 'Статистика'],
  ['Алгебра и начала математического анализа', 'Алгебра'],
  ['Основы безопасности и защиты Родины', 'ОБЗР'],
  ['Начальная военная подготовка', 'НВП'],
  ['Труд (технология)', 'Технология'],
  ['Основы духовно-нравственной культуры народов России', 'ОДНКНР'],
  ['Элективный курс по математике Математика вокруг нас', 'ЭК Математика'],
  ['Элективный курс по обществознанию Актуальные вопросы обществознания', 'ЭК Обществознание']
]

const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

function updateSubjectNames(text) {
  subject_names.forEach(name => {
    text = text.replace(name[0], name[1])
  });
  return text
}

function checkAbsence(absence_name) {
  if (!absence_name) return false
  if (absence_name == 'Неявка' || absence_name == 'Болеет' || absence_name == 'Пропуск') return true
  return false
}

function updateNoteNames(note_name) {
  if (!note_name) return ''
  return note_name.replace('самостоятельная работа', 'с/р')
}

function get_edu_year(date) {
  const now = new Date();
  const month1 = now.getMonth();
  const month2 = parseInt(date.split('.')[1]);
  if ((month1 < 6) == (month2 < 6)) {
    return now.getFullYear();
  } else if ((month1 < 6) > (month2 < 6)) {
    return now.getFullYear() - 1;
  } else {
    return now.getFullYear() + 1;
  }
}

export async function getStudentByName(gid, name) {
  const res = await fetch('https://de.edu.orb.ru/er/index/lookup/PARTICIPANTFK?parent=' + gid, { headers: headers })
  if (res.ok) {
    const json = await res.json()
    return json.data.find(x => x.text.includes(name))
  }
  return null
}

export async function getMarks(sid, gid, period) {
  const date_begin = periods[period][0] + '.' + get_edu_year(periods[period][0]);
  const date_end = periods[period][1] + '.' + get_edu_year(periods[period][1]);

  const query = [
    `GRADEFK=${gid}`,
    `PARTICIPANTFK=${sid}`,
    `DATE_BEGIN=${date_begin}`,
    `DATE_END=${date_end}`,
  ].join('&');
  const res = await fetch('https://de.edu.orb.ru/er/index/report/report/progress/participant_marks?' + query,
    {
      headers: headers
    }
  )
  return res.text().then((x => {
    const doc = parse(x);
    const sheet0 = doc.querySelector('#sheet0');
    const subjects = [...sheet0.querySelectorAll('tr[class^=row]')].slice(4).map(subject => ({
      name: updateSubjectNames(subject.querySelector('td.column1').innerHTML),
      average: parseFloat(subject.querySelector('td.column3').innerHTML),
      skips: [...Array(4).keys()].map(n => (parseInt(subject.querySelector('td.column' + (n + 4)).innerHTML))).reduce((b, a) => b + a, 0),
      marks: subject.querySelector('td.column2').innerHTML != 'Нет' ? subject.querySelector('td.column2').innerHTML.split(', ').map(x => parseInt(x)) : []
    })
    )
    let answer = {
      date_begin,
      date_end,
      subjects,
      mode: 'pm'
    }
    return answer;
  }))
}

export async function getFinalMarks(sid, gid) {
  const query = [
    `GRADEFK=${gid}`,
    `PARTICIPANTFK=${sid}`,
  ].join('&');
  const res = await fetch('https://de.edu.orb.ru/er/index/report/report/progress/participant_period_marks?' + query,
    {
      headers: headers
    }
  )
  return res.text().then((x => {
    const doc = parse(x);
    const sheet0 = doc.querySelector('#sheet0');
    const subjects = [...sheet0.querySelectorAll('tr[class^=row]')].slice(4).map(subject => ({
      name: updateSubjectNames(subject.querySelector('td.column1').innerHTML),
      q1: parseInt(subject.querySelector('td.column2').innerHTML),
      q2: parseInt(subject.querySelector('td.column3').innerHTML),
      q3: parseInt(subject.querySelector('td.column4').innerHTML),
      q4: parseInt(subject.querySelector('td.column5').innerHTML),
      year: parseInt(subject.querySelector('td.column6').innerHTML)
    })
    )
    let answer = {
      subjects,
      mode: 'fm'
    }
    return answer;
  }))
}

export async function getDiary(sid, date) {
  const res = await fetch('https://de.edu.orb.ru/edv/index/diary/' + sid + '?date=' + date, { headers: headers })
  return res.json().then((json => {
    return Object.entries(json.data.diary).map(([name, day]) => {
      return {
        date: name.split('. ')[0],
        name: name.split('. ')[1],
        lessons: day.map(lesson => (
          {
            subject: updateSubjectNames(lesson.subject),
            topic: lesson.topic,
            number: parseInt(lesson.lessonNumber),
            time: call_shedule[parseInt(lesson.lessonNumber) - 1],
            homework: lesson.previousHomework?.homework.replace(linkRegex, (match) => `<a class='text-link' target="_blank" href='${match}' key={i}> ${(new URL(match)).hostname} </a>`),
            note: updateNoteNames(lesson.notes[0]),
            absence: checkAbsence(lesson.absenceRaw[0]),
            mark: lesson.marksRaw[0]
          }
        ))
      }
    })
  }))
}

export { updateSubjectNames, periods };