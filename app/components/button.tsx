import React, {ButtonHTMLAttributes, ReactNode, useMemo} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    buttonText: string;
    styleClass?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    isLoading?: boolean;
}

function Button({icon, buttonText, styleClass, variant = 'primary', ...rest}: ButtonProps) {

    const buttonVariant = useMemo(() => {
        switch (variant) {
            case 'secondary':
                return 'gray';
            case 'success':
                return 'green';
            case 'warning':
                return 'yellow';
            case 'danger':
                return 'red';
            default:
                return 'blue';
        }
    }, [variant]);

    const buttonClass = `flex items-center bg-${buttonVariant}-600 px-4 py-1 rounded-md hover:bg-bg-${buttonVariant}-800 disabled:bg-bg-${buttonVariant}-800 disabled:cursor-not-allowed ${styleClass}`
    return (
        <button
            className={buttonClass}
            {...rest}
        >
            {icon && <span className={'me-1'}>{icon}</span>}
            <span>{buttonText}</span>
        </button>
    );
}

export default Button;