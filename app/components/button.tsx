'use client'
import React, {ButtonHTMLAttributes, ReactNode } from 'react';
import {buttonVariantStyles} from "@/app/constants/contants";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    buttonText: string;
    styleClass?: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

function Button({icon, buttonText, styleClass, variant = 'primary', ...rest}: ButtonProps) {
    const buttonClass = `flex items-center px-4 py-1 rounded-md disabled:cursor-not-allowed transition-all duration-200 ease-in-out ${buttonVariantStyles[variant]} ${styleClass ?? ''}`

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