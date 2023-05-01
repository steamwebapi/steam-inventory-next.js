import {Inter} from 'next/font/google'
import Screen from "@/components/screen"
import {useEffect, useState} from "react";
import moment from "moment";
import InventoryItem from "@/components/inventoryItem";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

const inter = Inter({subsets: ['latin']})

export default function SteamId({inventory, profile, inventoryStatus, profileStatus}) {
    const [totalWorth, setTotalWorth] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        // Sum all the prices from inventory
        let total = 0;
        if (inventory === null) {
            setError("Inventory not found");
            return;
        };

        if (inventoryStatus !== 200) {
            setError(inventory.error);
        }

        if (inventoryStatus === 200) {
            setError(inventory.error);
            inventory.forEach(item => {
                total += parseFloat(item.priceLatest);
            });

            setTotalWorth(total.toFixed(2));

            // sort the inventory array by price
            inventory.sort((a, b) => {
                return b.priceLatest - a.priceLatest;
            });
        }

    }, [inventory, profile]);

    return (
        <main
            className={`flex min-h-screen flex-col items-center ${inter.className}">
`}
        >
            <Screen>
                <div className="flex flex-col items-start justify-center w-full bg-gray-800">
                    <div className="flex flex-col w-full px-10 pt-10 pb-8 gap-4 justify-start">
                        <div className="flex flex-col lg:flex-row  items-center gap-2 lg:gap-10 text-gray-700">
                            <button
                                className="btn btn-primary bg-gray-700 border-gray-600 flex flex-row gap-1  rounded w-48"
                                onClick={() => window.history.back()}>
                                <ArrowLeftIcon className="w-6 h-6"/>
                                BACK
                            </button>
                            <span>
                                {profile.profileurl}
                            </span>
                            <span>
                                {profile.steamid}
                            </span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <img src={profile.avatarfull} alt="Profile Logo" className="rounded w-48 h-48"/>
                            <div className="profile-name flex justify-center items-start flex-col gap-2 ml-4">
                                <h1 className="text-2xl font-bold text-white w-full">
                                    Inventory from <a href={profile.profileurl} target="_blank"
                                                      className="underline">{profile.personaname}</a>
                                </h1>
                                {profile.personastateflags === 1 && (
                                    <span
                                        className="flag country flex gap-4 items-center justify-start text-white text-xl">
                                <img
                                    src={`https://flagsapi.com/${profile.loccountrycode}/flat/32.png`}/> {profile.loccountrycode}
                            </span>
                                )}
                                <span className="createdAt text-gray-500 text-base moment-js">
                                Since: {moment(profile.timecreated * 1000).fromNow()}
                            </span>
                                <span className="online-or-offline text-gray-500 text-base">
                                {profile.personastate === 0 ? 'Offline' : 'Online'}
                            </span>
                                <span className="total-worth text-xl text-white font-bold">
                                Total Worth: {totalWorth}$
                            </span>
                            </div>
                        </div>
                    </div>
                    {error === "" ?
                        <div
                            className="text-red-400 text-3xl font-bold flex justify-center mt-40 w-full">{error}</div> :
                        <div className="bg-gray-800 w-full mb-40">
                            {inventory && inventory.length > 0 ? (
                                <div className="flex flex-col flex-wrap px-8 justify-start lg:flex-row">
                                    {inventory.map((item, index) => (
                                        <InventoryItem item={item}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap gap-4 p-10 justify-center">
                                    <h1 className="text-3xl font-bold text-white w-full text-center">
                                        No items found
                                    </h1>
                                </div>
                            )}
                        </div>}
                </div>
            </Screen>
        </main>
    )
}


export const getServerSideProps = async (context) => {
    const {steamId} = context.params;

    // https://www.steamwebapi.com/steam/api/inventory
    const inventoryApi = `${process.env.BASE_API_URL}inventory?key=${process.env.BASE_API_KEY}&steam_id=${steamId}&parse=1`;
    const inventoryResponse = await fetch(inventoryApi);
    const inventoryStatus = inventoryResponse.status;
    const inventory = await inventoryResponse.json();


    // https://www.steamwebapi.com/steam/api/profile
    const profileApi = `${process.env.BASE_API_URL}profile?key=${process.env.BASE_API_KEY}&steam_id=${steamId}`;
    const profileResponse = await fetch(profileApi);
    const profileStatus = profileResponse.status;
    const profile = await profileResponse.json();

    if (profileStatus !== 200) {
        // send 404 page
        return {
            notFound: true,
        }
    }

    // Pass data to the page via props
    return {props: {inventory, profile, inventoryStatus, profileStatus}}
};
