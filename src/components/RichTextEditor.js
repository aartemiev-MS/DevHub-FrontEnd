import React, {useState, useRef} from 'react';
import JoditEditor from "jodit-react"; // https://github.com/jodit/jodit-react

export default function RichTextEditor(props) {
	const editor = useRef(null)
	
	const config = {
		readonly: false, // all options from https://xdsoft.net/jodit/doc/options/
        showCharsCounter: false,
        showWordsCounter: false,
        allowResizeX:false,
        allowResizeY:false,
        askBeforePasteFromWord:false,
        askBeforePasteHTML: false,
        readonly: props.isReadonly,
       // minHeight: '510px',
       // minWidth: '510px',
      //  maxHeight: '510px',
      //  maxWidth: '510px',
        buttons: [
            'source', '|',
            'bold',
            'italic', '|',
            'ul',
            'ol', '|',
            'font',
            'fontsize',
            'brush',
            'paragraph', '|',
            'image',
            'table',
            'link', '|',
            'left',
            'center',
            'right',
            'justify', '|',
            'undo', 'redo', '|',
            'hr',
            'eraser',
            'fullsize'
        ],

        toolbarAdaptive: false,
        height:'510px',
        width:'510px'
	}
	
	return (
            <JoditEditor
                value={props.content}
                config={config}
		onBlur={newContent => props.setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {}}
            />
        );
}