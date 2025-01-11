'use client'
import React, {useMemo, useState, useEffect, useCallback} from 'react';
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
import {IoPlay, IoStop} from "react-icons/io5";
import {useWebSocket} from './hooks/useWebSocket';
import {wsCompiler} from "@/app/api/endpoints";
import useViewPort from "@/app/hooks/useViewPort";

interface OutputState {
    stdout: string;
    stderr: string;
}

const Main = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState<OutputState>({stdout: '', stderr: ''});
    const [isRunning, setIsRunning] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const {selectedValue} = useSelection();
    const {theme} = useTheme();
    const isVerticalLayout = useViewPort(768);
    const previewRef = React.useRef<HTMLIFrameElement>(null);
    const isHtmlMode = selectedValue === 'html';

    const formatOutput = useCallback((stdout: string, stderr: string): string => {
        let formattedOutput = '';
        if (stdout) {
            formattedOutput += stdout;
        }
        if (stderr) {
            if (stdout && !stdout.endsWith('\n')) {
                formattedOutput += '\n';
            }
            formattedOutput += `Error:\n${stderr}`;
            if (!stderr.endsWith('\n')) {
                formattedOutput += '\n';
            }
        }
        return formattedOutput;
    }, []);

    const updateOutput = useCallback((newState: OutputState | ((prevState: OutputState) => OutputState)) => {
        if (typeof newState === 'function') {
            setOutput(newState);
        } else {
            setOutput(newState);
        }
    }, []);

    const handleOpen = useCallback(() => {
        setConnectionStatus('connected');
    }, []);

    const handleError = useCallback(() => {
        setConnectionStatus('error');
        updateOutput({
            stdout: '',
            stderr: 'WebSocket connection failed\n'
        });
    }, [updateOutput]);

    const handleClose = useCallback(() => {
        setConnectionStatus('disconnected');
    }, []);

    const {addMessageListener, runCode, stopCode} = useWebSocket({
        endpoint: wsCompiler,
        onOpen: handleOpen,
        onError: handleError,
        onClose: handleClose
    });

    useEffect(() => {
        const removeListener = addMessageListener((data) => {
            if (data.type === 'stdout') {
                setOutput((prev) => ({
                    ...prev,
                    stdout: prev.stdout + (data.data || '')
                }));
            } else if (data.type === 'stderr') {
                setOutput((prev) => ({
                    ...prev,
                    stderr: prev.stderr + (data.data || '')
                }));
            } else if (data.type === 'run' && data.message === 'your message has receive') {
                setOutput({stdout: '', stderr: ''});
            }
        });

        return () => {
            removeListener();
        };
    }, [addMessageListener]);

    const updateHtmlPreview = useCallback((htmlContent: string) => {
        if (previewRef.current) {
            const iframe = previewRef.current;
            const document = iframe.contentDocument || iframe.contentWindow?.document;
            if (document) {
                document.open();
                document.write(htmlContent);
                document.close();
            }
        }
    }, []);

    const handleChange = (value: string) => {
        setCode(value);
        if (isHtmlMode) {
            updateHtmlPreview(value);
        }
    };

    const handleRun = () => {
        setIsRunning(true);
        setOutput({stdout: '', stderr: ''});

        const languageMap: { [key: string]: string } = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'java',
            'c++': 'cpp',
            'rust': 'rust',
            'php': 'php',
            'html': 'html'
        };

        runCode(code, languageMap[selectedValue] || 'python');
    };

    const handleStop = () => {
        stopCode();
        setIsRunning(false);
    };

    const handleClear = () => {
        setOutput({stdout: '', stderr: ''});
    };

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return isRunning ? 'bg-yellow-500' : 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
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
        <div className="lg:py-24 md:ps-24 px-2 pb-4 pt-[8rem] h-dvh">
            <div className={'h-dvh p-2 rounded-md bg-gray-800 text-white'}>
                <PanelGroup autoSaveId="codePanel" direction={isVerticalLayout ? "vertical" : "horizontal"} className={'h-full'}>
                    <Panel defaultSize={50}>
                        <div className="flex justify-between">
                            <div className="text-gray-500 flex items-center gap-2">
                                Status:
                                <div className={`rounded-full w-4 h-4 ${getStatusColor()}`}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    buttonText={'Run'}
                                    variant={'success'}
                                    icon={<IoPlay/>}
                                    onClick={handleRun}
                                    disabled={isRunning || connectionStatus !== 'connected'}
                                />
                                <Button
                                    buttonText={'Stop'}
                                    variant={'danger'}
                                    icon={<IoStop/>}
                                    onClick={handleStop}
                                    disabled={!isRunning || connectionStatus !== 'connected'}
                                />
                            </div>
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
                    <PanelResizeHandle
                        className={`bg-gray-700 ${isVerticalLayout ? 'h-1 w-full my-2' : 'w-1 h-full mx-2'}`}
                    />
                    <Panel defaultSize={50}>
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                {isHtmlMode ? 'Preview:' : 'Output:'}
                            </span>
                            <Button
                                buttonText={'CLEAR'}
                                onClick={handleClear}
                                disabled={isHtmlMode ? !code : (!output.stdout && !output.stderr)}
                            />
                        </div>
                        <div className={'bg-gray-900 rounded-md h-full p-2'}>
                            {isHtmlMode ? (
                                <iframe
                                    ref={previewRef}
                                    className="w-full h-full bg-white rounded"
                                    title="HTML Preview"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            ) : (
                                <ReactCodeMirror
                                    className="h-dvh w-full"
                                    height={'100dvh'}
                                    value={formatOutput(output.stdout, output.stderr)}
                                    theme={themeValue as Extension}
                                    readOnly={true}
                                />
                            )}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default Main;