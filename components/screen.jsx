import React from 'react';
import {Spinner} from "@chakra-ui/react";

function Screen(props) {
    if (props.loading) {
        return <div className="flex flex-col items-center justify-center w-full min-h-screen h-full bg-gray-900">
            <Spinner size="xl" color='blue.500' />
        </div>;
    }
    return <div className="flex flex-col items-start w-full min-h-screen h-full bg-gray-900">
        {props.children}
    </div>;
}

export default Screen;
