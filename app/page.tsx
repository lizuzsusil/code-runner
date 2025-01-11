'use client'
import Navbar from "@/app/components/navbar";
import Sidebar from "@/app/components/sidebar";
import Main from "@/app/main";
import {SelectionProvider} from "@/app/context/selectionContext";
import {ThemeProvider} from "@/app/context/themeContext";

export default function Home() {
    return (
        <SelectionProvider>
            <ThemeProvider>
                <Navbar/>
                <Sidebar/>
                <Main/>
            </ThemeProvider>
        </SelectionProvider>
    );
}
