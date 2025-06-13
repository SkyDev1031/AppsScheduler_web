import React, { useRef } from 'react';
import { Button } from 'primereact/button';

export const SmartButton = ({
    icon,
    label,
    variant = 'primary',
    size = 'medium',
    className = '',
    disabled = false,
    loading = false,
    onClick,
    ...props
}) => {
    const buttonRef = useRef(null);

    const handleClick = (e) => {
        onClick && onClick(e);
    };

    return (
        <>
            <Button
                ref={buttonRef}
                className={`${className}`}
                onClick={handleClick}
                {...props}
            >
                {icon && <i className={`fa-solid ${icon}`} />}
                {label}
            </Button>
        </>
    );
};