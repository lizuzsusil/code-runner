import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: Array<string>;
    title: string;
}

function Select({options, title, ...rest}: SelectProps) {
    return (
        <select title={title}
                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 bg-gray-900 border-gray-700 text-white"
                {...rest}
        >
            {options.map((label, index) => (<option key={label} value={index}>{label}</option>))}
        </select>
    );
}

export default Select;