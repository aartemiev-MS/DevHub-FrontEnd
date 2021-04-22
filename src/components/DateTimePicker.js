import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { Input, TextFieldProps } from "@material-ui/core";

export default function DateTimePicker(props) {

    const [selectedDate, setSelectedDate] = useState(props.date && new Date(props.date));

    const onDateChange = date => {
        setSelectedDate(date);
    };

    const onClickSetDate = e => {
        setSelectedDate(Date.now())
    }

    if (props.dateName === 'Started') console.log('selectedDate:', selectedDate)

    return (selectedDate ?
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                margin="normal"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={onDateChange}
                autoOk
                inputVariant='outlined'
                className='date-picker'
            />
        </MuiPickersUtilsProvider> :
        <Tooltip title={"Set " + props.dateName + " Date"} arrow interactive >
            <Button onClick={onClickSetDate} variant="contained" color='primary'>Set</Button>
        </Tooltip >)

}