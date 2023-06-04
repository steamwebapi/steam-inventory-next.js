import {NextResponse} from 'next/server';

export const config = {
    runtime: 'edge', // do this is a pre-requisite for Edge Functions

};

export default async (req, res) => {
    const params = new URL(req.url).searchParams;
    const steamId = params.get('steamId');


    const inventoryApi = `${process.env.BASE_API_URL}inventory?key=${process.env.BASE_API_KEY}&steam_id=${steamId}&parse=1`;
    const inventoryResponse = await fetch(inventoryApi);
    const inventoryStatus = inventoryResponse.status;
    const inventory = await inventoryResponse.json();

    if (inventoryStatus !== 200) {
        return NextResponse.json({
            message: inventory.message,
        }, {
            status: inventoryStatus,
        });
    }

    return NextResponse.json(inventory);
};
