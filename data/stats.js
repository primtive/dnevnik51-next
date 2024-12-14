import { getEduData, setEduData } from './db';
import { parse } from 'node-html-parser';
import { updateSubjectNames, periods } from './journal'
import headers from '@/config/config'

const mean = array => Math.round((array.reduce((a, b) => a + b) / array.length + Number.EPSILON) * 100) / 100
const round = num => Math.round((num + Number.EPSILON) * 100) / 100

function getTimestamp() {
  return Date.now().valueOf();
}

async function updateEduData(data) {
  var students = await Promise.all(data.students.map(async (student) => {
    const response = await fetch("https://de.edu.orb.ru/er/index/report/report/progress/participant_marks?" + new URLSearchParams({
      GRADEFK: data.gid,
      PARTICIPANTFK: student.sid,
      DATE_BEGIN: periods.year[0] + '.2024',
      DATE_END: periods.year[1] + '.2025'
    }).toString(), {
      "headers": headers,
      "body": null,
      "method": "GET"
    });
    const html = await response.text();
    const root = parse(html).querySelector('#sheet0').lastChild;
    var subjects = [];
    var row_id = 4;
    while (true) {
      const tr = root.querySelector('.row' + row_id);
      if (tr == null) break;
      row_id = row_id + 1;
      var marks = [];
      if (tr.querySelector('.column2').innerHTML != 'нет') {
        tr.querySelector('.column2').innerHTML.split(', ').forEach(mark => {
          marks.push(parseInt(mark));
        });
      }
      subjects.push({
        name: updateSubjectNames(tr.querySelector('.column1').innerHTML),
        marks: marks,
        average: parseFloat(tr.querySelector('.column3').innerHTML)
      })
      root.removeChild(tr);
    }
    student.subjects = subjects
    if (student.name.endsWith('(отчислен)')) return null
    return student
  }))
  students = students.filter(x => x != null)
  data.students = students
  return data
}

async function parseEduData(gid) {
  const response = await fetch("https://de.edu.orb.ru/er/index/lookup/PARTICIPANTFK?" + new URLSearchParams({ parent: gid, }).toString(),
    {
      "headers": headers,
      "method": "GET"
    });
  const json = await response.json();
  if (json.success) {
    var edu_data = {
      gid: gid,
      last_update: getTimestamp(),
      students: json.data.map(student => ({
        sid: student.id,
        name: student.text,
        subjects: []
      }))
    };
    return edu_data
  } else {
    return {}
  }
}

class Statistics {
  constructor(sid, gid) {
    this.sid = sid
    this.gid = gid
  }
  async loadEduData() {
    var edu_data = await getEduData(this.gid)
    if (edu_data == null) {
      edu_data = await parseEduData(this.gid)
      edu_data = await updateEduData(edu_data)

      await setEduData(edu_data)
    }
    if (getTimestamp() - edu_data.last_update > (259200 * 1000)) {
      this.edu_data = await updateEduData(edu_data)
      this.edu_data.last_update = getTimestamp()
      await setEduData(edu_data)
    } else {
      this.edu_data = edu_data
    }
  }
  getRating(students) {
    var data = {};
    for (const subject of students[0].subjects) {
      data[subject.name] = {
        averages: [],
        counts: [],
      }
    }
    for (const student of students) {
      for (const subject of student.subjects) {
        data[subject.name].averages.push(subject.average)
        data[subject.name].counts.push(subject.marks.length)
      }
    }
    for (const [name, val] of Object.entries(data)) {
      data[name].average = mean(val.averages)
      data[name].count = mean(val.counts)
      delete data[name].averages
      delete data[name].counts
    }
    return data
  }
  getStudentPosition() {
  }
  getStatistics() {
    // Может пригодится - рейтинг по каждому предмету
    // var students = this.edu_data.students.map(student => this.getRating([student])

    var ratings = {};
    Object.entries(this.getRating(this.edu_data.students)).forEach(([name, rating]) => {
      ratings[name] = { grade: rating }
    });
    Object.entries(this.getRating([this.edu_data.students.find((x) => x.sid == this.sid)])).forEach(([name, rating]) => {
      ratings[name]['student'] = rating,
        ratings[name]['relative'] = {
          average: round(rating.average - ratings[name].grade.average),
          count: round(rating.count - ratings[name].grade.count)
        }
    });
    var students = this.edu_data.students.map(student => ({
      rating: Object.values(this.getRating([student])).reduce((acc, a) => ({
        average: acc.average + a.average,
        count: acc.count + a.count,
      }), { average: 0, count: 0 }),
      sid: student.sid
    }))

    students.sort((a, b) => b.rating.average - a.rating.average)
    const positionAverage = students.findIndex(s => s.sid == this.sid) + 1

    students.sort((a, b) => b.rating.count - a.rating.count)
    const positionCount = students.findIndex(s => s.sid == this.sid) + 1

    let ratingsCopy = Object.entries(ratings);
    ratingsCopy.sort((a, b) => (a[1].relative.average - b[1].relative.average))
    const worst = ratingsCopy[0]
    const best = ratingsCopy[Object.keys(ratingsCopy).length - 1]

    const averageRating = round(ratingsCopy.map(([name, rating]) => rating.relative.average).reduce((a, b) => a + b))
    const countRating = round(ratingsCopy.map(([name, rating]) => rating.relative.count).reduce((a, b) => a + b))

    const stats = {
      ratings,
      positionAverage,
      worst,
      best,
      positionCount,
      averageRating,
      countRating,
      lastUpdate: this.edu_data.last_update
    }
    return stats
  }
}

export async function getStats(sid, gid) {
  const stats = new Statistics(sid, gid)
  await stats.loadEduData();
  const stats_data = stats.getStatistics()
  return stats_data
}
