import React from 'react';
import language from '@/app/assets/img/language.svg'
import {languageOptions} from "@/app/constants/contants";
import Link from "next/link";

function Sidebar() {
    return (
        <aside aria-label={'sidebar'}
               className='fixed top-[6.5rem] md:top-[4.5rem] left-0 z-40 h-screen w-fit bg-gray-800 dark:border-gray-700 transition-transform -translate-x-full sm:translate-x-0'>
            <div className={'flex flex-col justify-between h-[90%] p-4 bg-gray-800'}>
                <ul className="space-y-2 font-medium">
                    {languageOptions.map(item => (
                        <li key={item} className={'w-12'}>
                            <Link
                                className={'flex items-center p-2 rounded-lg group text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out'}
                                href={'#'}>
                                <svg
                                    type={`${item}-icon`}
                                    className={'w-8 h-8'}
                                    viewBox="0 0 128 128"
                                >
                                    <use href={`${language.src}#${item}`}/>
                                </svg>
                            </Link>
                        </li>
                    ))}
                </ul>
                <span className="text-xs text-gray-500">Sushil AC</span>
            </div>
        </aside>
    );
}

export default Sidebar;