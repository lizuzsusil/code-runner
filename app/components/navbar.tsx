import React from 'react';
import Link from "next/link";
import Image from "next/image";
import codeRunnerLogo from "@/app/assets/img/codeRunner_.png"
import Button from "@/app/components/button";
import {IoPlay} from "react-icons/io5";
import {IoStop} from "react-icons/io5";
import {IoReorderThree} from "react-icons/io5";
import Select from "@/app/components/select";

const languageOptions = ['python', 'html', 'javascript', 'java', 'c++', 'rust', 'php'];

function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full bg-gray-800">
            <div className="px-3 py-1 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center gap-4">
                        <button type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <IoReorderThree/>
                        </button>
                        <Link href="/" className="flex items-center py-[8px]">
                            <Image
                                src={codeRunnerLogo}
                                className="h-10 w-10 me-3"
                                alt="Code Runner logo"/>
                            <span
                                className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Code Runner</span>
                        </Link>
                    </div>
                    <div className="flex gap-2 lg:gap-6 items-center">
                        <Select options={languageOptions} title={'language'} />
                        <div className="flex gap-2">
                            <Button buttonText={'Run'} variant={'success'} icon={<IoPlay/>}/>
                            <Button buttonText={'Stop'} variant={'danger'} icon={<IoStop/>}/>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;