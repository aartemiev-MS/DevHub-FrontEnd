import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

export default function DateTimePicker(props) {

    return (props.date ?
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                format="MM/dd/yyyy"
                value={new Date(props.date)}
                onChange={date => props.handleOnChangeDate(props.taskId, Date.parse(date), props.dateTypeIndex)}
                autoOk
                inputVariant='outlined'
                className='date-picker'
                readOnly={props.readOnly}
            />
        </MuiPickersUtilsProvider> :
        !props.readOnly &&
        <Tooltip
            title={"Set " + props.dateName + " Date"}
            arrow
            interactive >
            <Button
                onClick={() => props.handleOnChangeDate(props.taskId, Date.now(), props.dateTypeIndex)}
                variant="contained"
                color='primary'>
                Set
                 </Button>
        </Tooltip >)


}