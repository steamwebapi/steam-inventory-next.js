import React from 'react';

function InventoryItem(props) {
    return <div className="w-full lg:w-1/5">
        <div className="card bg-gray-900 shadow-xl m-2 rounded">
            <figure className="w-full h-[200px] flex flex-center">
                <img src={props.item.image} alt="Inventory Image" className="max-w-[200px]"/></figure>
            <div className="card-body">
                <h2 className="card-title text-base h-[60px] flex flex-start items-start text-white">
                    {props.item.markethashname}
                </h2>
                <div className="card-actions justify-between text-gray-400 flex items-center">
                    <div className="text-xl uppercase text-white font-bold">{props.item.pricelatest}$</div>
                    <div className="badge badge-outline p-4 uppercase">{props.item.itemgroup}</div>
                </div>
            </div>
        </div>
    </div>;
}

export default InventoryItem;
