import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CustomInput = forwardRef((props, ref) => {
    const { onEnter, onCancelEdit, editing, onChange, value: text, ...rest } = props;

    const inputRef = useRef()
    const [selection, setSelection] = useState()

    useEffect(() => {
        if (!selection) return;
        const { start, end } = selection;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start, end);
    }, [selection])

    useImperativeHandle(ref, () => {
        return { focus, appendText, normalFocus }
    });

    const focus = (start = null, end = null) => {
        if (start === null) start = inputRef.current.selectionStart;
        if (end === null) end = inputRef.current.selectionEnd;
        setSelection({ start, end })
    }
    const normalFocus = () => {
        inputRef.current.focus();
    }
    const changeText = (txt) => {
        if (typeof onChange == 'function') onChange(txt)
    }
    const appendText = (emoji) => {
        const start = inputRef.current.selectionStart;
        const end = inputRef.current.selectionEnd;
        const new_txt = [text.slice(0, start), emoji, text.slice(end)].join("");
        changeText(new_txt);
        focus(start + emoji.length, start + emoji.length);
    }
    const onKeyDown = (e) => {
        if (e.keyCode == 13 && typeof onEnter == 'function') onEnter();
        if (e.keyCode == 27 && typeof onCancelEdit == 'function') onCancelEdit();
    }

    return (
        <div className='message-input'>
            <input
                {...rest}
                value={text}
                ref={inputRef}
                onChange={e => changeText(e.target.value)}
                onKeyDown={onKeyDown}
            />
            {editing &&
                <div className='cancel-edit' onClick={onCancelEdit}>
                    <FaTimes />
                </div>
            }
        </div>
    )
});

export default CustomInput