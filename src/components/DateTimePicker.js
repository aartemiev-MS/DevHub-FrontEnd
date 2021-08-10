import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

export default function DateTimePicker(props) {

    const pickerWithDate=date=>{
        return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
            format="MMM dd"
            value={date?new Date(date):Date.now()}
            onChange={date => props.handleOnChangeDate(props.taskId, Date.parse(date), props.dateTypeIndex)}
            autoOk
            inputVariant='outlined'
            className={'date-picker' +(date?'':' hidden-item')}
            readOnly={props.readOnly}
        />
    </MuiPickersUtilsProvider>
    }

    const setDateButton=()=>{
        return <Tooltip
        title={"Set " + props.dateName + " Date"}
        arrow
        interactive >
        <Button
            onClick={() => props.handleOnChangeDate(props.taskId, Date.now(), props.dateTypeIndex)}
            variant="contained"
            color='primary'>
            Set
             </Button>
    </Tooltip>
    }

    const getDateTooltipText=()=>{
        const _MS_PER_MINUTE = 1000 * 60
            const _MS_PER_HOUR = _MS_PER_MINUTE * 60
            const _MS_PER_DAY = _MS_PER_HOUR * 24;
            const _MS_PER_MONTH = _MS_PER_DAY * 30

            const jsEventDate = new Date(props.date)
            const jsDateNow = new Date(Date.now())

            const delta =jsDateNow.getTime()-jsEventDate.getTime()
            let deltaReport

            if(delta<=_MS_PER_HOUR){
                deltaReport = `${Math.round(delta/_MS_PER_MINUTE)} mitunes ago`
            }else if(delta<=_MS_PER_DAY){
                deltaReport = `${Math.round(delta/_MS_PER_HOUR)} hours ago`
            }else if(delta<=(_MS_PER_MONTH*3)){
                deltaReport = `${Math.round(delta/_MS_PER_DAY)} days ago`
            }else{
                deltaReport = `${Math.round(delta/_MS_PER_MONTH)} months ago`
            }

            return `${jsEventDate.getDay()} ${jsEventDate.toLocaleString('default', { month: 'long' })} ${jsEventDate.getFullYear()} at ${jsEventDate.getHours()}:${jsEventDate.getMinutes()} -  ${deltaReport}`
          }

    const getDateSpanText=()=>{
        const shortMonthName=new Date(props.date).toLocaleString('default', { month: 'long' }).substring(0,3)
        const dayNumber=new Date(props.date).getDate();
        return `${shortMonthName} ${dayNumber}`
    }

    if(props.date){
        if(props.readOnly||!props.canEditDates){            
      return <Tooltip title={getDateTooltipText()} arrow interactive>
                <span>{getDateSpanText()}</span>
                </Tooltip>
    } else {
        return pickerWithDate(props.date)
    }
    }else{
        if(props.readOnly||!props.canEditDates){
           return pickerWithDate(null)
        } else {
          return  setDateButton() //empty and invisible
        }
    }
}