'use client'
import React, {useMemo, useState} from 'react';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import ReactCodeMirror, {Extension} from "@uiw/react-codemirror";
import {javascript} from '@codemirror/lang-javascript';
import {html} from '@codemirror/lang-html';
import {python} from "@codemirror/lang-python";
import {java} from "@codemirror/lang-java";
import {cpp} from "@codemirror/lang-cpp";
import {rust} from "@codemirror/lang-rust";
import {php} from "@codemirror/lang-php"
import {useSelection} from "@/app/context/selectionContext";
import * as themes from '@uiw/codemirror-themes-all';
import Button from "@/app/components/button";
import {useTheme} from "@/app/context/themeContext";

const Main = () => {
    const [code, setCode] = useState('');
    const {selectedValue} = useSelection();
    const {theme} = useTheme();

    const handleChange = (value: string) => {
        setCode(value);
    };

    const themeValue = themes[theme as keyof typeof themes];

    const languageExtension = useMemo((): Extension => {
        switch (selectedValue) {
            case 'html':
                return html();
            case 'javascript':
                return javascript();
            case 'java':
                return java();
            case 'c++':
                return cpp();
            case 'rust':
                return rust();
            case 'php':
                return php();
            default:
                return python();
        }
    }, [selectedValue]);

    return (
        <div className="lg:py-24 md:ps-24  px-2 pb-4 pt-[8rem] h-dvh">
            <div className={'h-dvh p-2 rounded-md bg-gray-800 text-white'}>
                <PanelGroup autoSaveId="codePanel" direction="horizontal" className={'h-full'}>
                    <Panel defaultSize={50}>
                        <div className="text-gray-500 flex items-center gap-2">Status: <div
                            className="rounded-full w-4 h-4 bg-green-500"></div>
                        </div>
                        <div className={'bg-gray-900 rounded-md h-full p-2'}>
                            <ReactCodeMirror
                                className="h-dvh w-full"
                                height={'100dvh'}
                                value={code}
                                theme={themeValue as Extension}
                                extensions={[languageExtension]}
                                onChange={handleChange}
                            />
                        </div>
                    </Panel>
                    <PanelResizeHandle className='w-1 h-full bg-gray-700 mx-2'/>
                    <Panel defaultSize={50}>
                        <div className="flex justify-between"><span className="text-gray-500">Output: </span>
                            <Button buttonText={'CLEAR'}/>
                        </div>
                        <div className={'bg-gray-900 rounded-md h-full p-2'}>
                            <ReactCodeMirror
                                className="h-dvh w-full"
                                height={'100dvh'}
                                value={code}
                                theme={themeValue as Extension}
                                extensions={[languageExtension]}
                                onChange={handleChange}
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default Main;