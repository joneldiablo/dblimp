import React, { createRef } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { Value, View } from "react-calendar/dist/shared/types";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import GoatComponent, {
  GoatComponentProps,
  GoatComponentState,
} from "@dblimp/core/goat-component";
import { eventHandler } from "@dblimp/core";

import schema from "./calendar-field.json";

import "./style.scss";

export interface CalendarFieldProps extends GoatComponentProps {
  calendarProps: Partial<CalendarProps>;
}

export interface CalendarFieldState extends GoatComponentState {}

export default class CalendarField extends GoatComponent<
  CalendarFieldProps,
  CalendarFieldState
> {
  static jsClass = "CalendarField";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    calendarProps: {},
    childrenIn: undefined,
  };

  position = "relative";
  style = { width: "fit-content" };
  calendarRef: React.RefObject<any>;
  dayDom: HTMLElement | null = null;

  constructor(props: CalendarFieldProps) {
    super(props);
    this.events.push([
      this.props.name + "-hoursList",
      this.onSelectHour.bind(this),
    ]);
    this.calendarRef = createRef<typeof Calendar>();
  }

  disabledDays({ date, view }: { date: Date; view: View }): boolean {
    if (view !== "month") return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  onChangeCalendar(value: Value, event: React.MouseEvent<HTMLButtonElement>) {
    this.dayDom = event.target as HTMLElement;
    let formattedValue: string | (string | null)[] | null = null;
    if (Array.isArray(value)) {
      formattedValue = (value as Date[]).map((v) =>
        v ? moment(v).toISOString() : null
      );
    } else {
      formattedValue = value ? moment(value as Date).toISOString() : null;
    }
    if (this.state.formattedValue !== formattedValue) {
      this.setState({ hour: null, finalValue: null });
      eventHandler.dispatch(this.props.name, {
        [this.props.name]: null,
      });
    }
    this.setState({ formattedValue }, () => {
      eventHandler.dispatch("update." + this.props.name + "-hours", {
        open: true,
      });
    });
  }

  onSelectHour({ [this.props.name + "-hoursList"]: value }: any) {
    const finalValue = moment(this.state.formattedValue)
      .set({
        hour: value,
      })
      .toISOString();

    this.setState({
      hour: value,
      finalValue,
    });

    eventHandler.dispatch(this.props.name, {
      [this.props.name]: finalValue,
    });
    eventHandler.dispatch("update." + this.props.name + "-hours", {
      open: false,
    });
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").slice(1).join("-");
    switch (id) {
      case "calendar": {
        return {
          content: (
            <Calendar
              inputRef={this.calendarRef}
              minDate={moment().add(1, "day").toDate()}
              maxDate={moment().add(2, "months").toDate()}
              value={this.state.formattedValue}
              {...conf.calendarProps}
              {...this.props.calendarProps}
              onChange={this.onChangeCalendar.bind(this)}
              tileDisabled={this.disabledDays.bind(this)}
            />
          ),
        };
      }
      case "hours": {
        return {
          floatAround: this.dayDom,
        };
      }
      case "hoursList": {
        return {
          value: this.state.hour,
        };
      }
      case "value": {
        return {
          active: !!this.state.finalValue,
          content: this.state.finalValue,
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}