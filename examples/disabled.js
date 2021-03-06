/* eslint no-console:0 */

import 'rc-time-picker/assets/index.less';

import React from 'react';
import ReactDom from 'react-dom';

import GregorianCalendar from 'gregorian-calendar';
import DateTimeFormat from 'gregorian-calendar-format';

import TimePicker from 'rc-time-picker';
import TimePickerLocale from 'rc-time-picker/src/locale/zh_CN';

const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

const formatter = new DateTimeFormat(str);

const now = new GregorianCalendar(TimePickerLocale.calendar);
now.setTime(Date.now());

function generateOptions(length, excludedOptions) {
  const arr = [];
  for (let value = 0; value < length; value++) {
    if (excludedOptions.indexOf(value) < 0) {
      arr.push(value);
    }
  }
  return arr;
}

function onChange(value) {
  console.log(value && formatter.format(value));
}

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
}

function disabledMinutes(h) {
  switch (h) {
    case 9:
      return generateOptions(60, [30]);
    case 21:
      return generateOptions(60, [0]);
    default:
      return generateOptions(60, [0, 30]);
  }
}

function disabledSeconds(h, m) {
  return [h + m % 60];
}

ReactDom.render(
  <TimePicker formatter={formatter} locale={TimePickerLocale}
              showSecond={showSecond}
              defaultValue={now}
              className="xxx"
              onChange={onChange}
              disabledHours={disabledHours}
              disabledMinutes={disabledMinutes}
              disabledSeconds={disabledSeconds}/>,
  document.getElementById('__react-content')
);
