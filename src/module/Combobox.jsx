import React, {PropTypes} from 'react';
import Select from './Select';
import GregorianCalendar from 'gregorian-calendar';

const formatOption = (option, disabledOptions) => {
  let value = `${option}`;
  if (option < 10) {
    value = `0${option}`;
  }

  let disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value,
    disabled,
  };
};

const Combobox = React.createClass({
  propTypes: {
    formatter: PropTypes.object,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    showHour: PropTypes.bool,
    gregorianCalendarLocale: PropTypes.object,
    showSecond: PropTypes.bool,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onCurrentSelectPanelChange: PropTypes.func,
  },

  onItemChange(type, itemValue) {
    const { onChange } = this.props;
    let value = this.props.value;
    if (value) {
      value = value.clone();
    } else {
      value = this.getNow().clone();
    }
    if (type === 'hour') {
      value.setHourOfDay(itemValue);
    } else if (type === 'minute') {
      value.setMinutes(itemValue);
    } else {
      value.setSeconds(itemValue);
    }
    onChange(value);
  },

  onEnterSelectPanel(range) {
    this.props.onCurrentSelectPanelChange(range);
  },

  getHourSelect(hour) {
    const { prefixCls, hourOptions, disabledHours, showHour } = this.props;
    if (!showHour) {
      return null;
    }
    const disabledOptions = disabledHours();

    return (
      <Select
        prefixCls={prefixCls}
        options={hourOptions.map(option => formatOption(option, disabledOptions))}
        selectedIndex={hourOptions.indexOf(hour)}
        type="hour"
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'hour')}
      />
    );
  },

  getMinuteSelect(minute) {
    const { prefixCls, minuteOptions, disabledMinutes } = this.props;
    const value = this.props.value || this.getNow();
    const disabledOptions = disabledMinutes(value.getHourOfDay());

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map(option => formatOption(option, disabledOptions))}
        selectedIndex={minuteOptions.indexOf(minute)}
        type="minute"
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'minute')}
      />
    );
  },

  getSecondSelect(second) {
    const { prefixCls, secondOptions, disabledSeconds, showSecond } = this.props;
    if (!showSecond) {
      return null;
    }
    const value = this.props.value || this.getNow();
    const disabledOptions = disabledSeconds(value.getHourOfDay(), value.getMinutes());

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map(option => formatOption(option, disabledOptions))}
        selectedIndex={secondOptions.indexOf(second)}
        type="second"
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'second')}
      />
    );
  },

  getNow() {
    if (this.showNow) {
      return this.showNow;
    }
    const value = new GregorianCalendar(this.props.gregorianCalendarLocale);
    value.setTime(Date.now());
    this.showNow = value;
    return value;
  },

  render() {
    const { prefixCls } = this.props;
    const value = this.props.value || this.getNow();
    return (
      <div className={`${prefixCls}-combobox`}>
        {this.getHourSelect(value.getHourOfDay())}
        {this.getMinuteSelect(value.getMinutes())}
        {this.getSecondSelect(value.getSeconds())}
      </div>
    );
  },
});

export default Combobox;
