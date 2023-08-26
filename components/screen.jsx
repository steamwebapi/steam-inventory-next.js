import React from 'react';
import {Spinner} from "@chakra-ui/react";
import Link from "next/link";

function Screen(props) {
    if (props.loading) {
        return <div className="flex flex-col items-center justify-center w-full min-h-screen h-full bg-gray-900">
            <Spinner size="xl" color='blue.500'/>
        </div>;
    }
    return <div className="flex flex-col items-start w-full min-h-screen h-full bg-gray-900">
        <div className="flex h-16 text-white top-0 bg-gray-800 w-full items-center px-4 text-2xl">
            Here is a better and newer Inventory Calculator:
            <Link href="https://www.csbackpack.net">
                <span className="text-blue-500 ml-2">https://www.csbackpack.net</span>
            </Link>
        </div>
        {props.children}
    </div>;
}

export default Screen;
