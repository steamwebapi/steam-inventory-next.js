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
        <Link href="https://www.csbackpack.net" className="w-screen">
            <div className="flex w-screen h-20 text-white top-0 bg-gray-800 w-full items-center px-4 text-2xl bg-red-900">
                Here is a better and newer Inventory Calculator:

                <span className="text-white underline ml-2">www.csbackpack.net</span>

            </div>
        </Link>
        {props.children}
    </div>;
}

export default Screen;
