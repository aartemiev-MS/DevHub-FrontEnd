import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function ControlPanel(props) {

    const handleBranchesInfoChange = event => props.setShowBranchesInfo(event.target.checked)
    const handleDatesInfoChange = event => props.setShowDatesInfo(event.target.checked)


    return (
        <div className='control-panel-wrap'>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.showBranchesInfo}
                        onChange={handleBranchesInfoChange}
                        color="primary"
                    />
                }
                label="Show branches info"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.showDatesInfo}
                        onChange={handleDatesInfoChange}
                        color="primary"
                    />
                }
                label="Show dates info"
            />
        </div>
    )
}