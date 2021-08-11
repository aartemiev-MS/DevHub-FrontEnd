import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function BranchSelect(props) {

    const handleChange = e => {
        props.onChange( e.target.value)
    }

    return <FormControl variant="outlined" className='branch-select'>
        <Select
            value={props.selectedValue}
            color='primary'
            onChange={handleChange}
        >
            <MenuItem
                className='branch-select-item'
                key={-1}
                value={null}>
                    Not Selected
                </MenuItem>
            {props.solutionData.branchesNames.map(solution =>
                <MenuItem
                className='branch-select-item'
                    key={solution}
                    value={solution}>
                    {solution}
                </MenuItem>)}
        </Select>
    </FormControl>
}