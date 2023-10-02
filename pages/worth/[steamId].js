import {Inter} from 'next/font/google'
import Screen from "@/components/screen"
import React, {useEffect, useState} from "react";
import moment from "moment";
import InventoryItem from "@/components/inventoryItem";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import Head from "next/head";
import {Spinner} from "@chakra-ui/react";

const inter = Inter({subsets: ['latin']})

export default function SteamId({profile, profileStatus, steamId}) {
    const [totalWorth, setTotalWorth] = useState(0);
    const [error, setError] = useState("");
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        const res = await fetch('/api/inventory?steamId=' + encodeURIComponent(steamId));

        if (res.status === 401) {
            alert('is it your first time here? please add your api key in the .env file');
            console.log('#################### API KEY IS NOT VALID ####################');
        }

        if (res.status === 429) {
            console.log('################# API LIMITS REACHED #################');
        }

        if (res.status === 200) {
            return await res.json();
        }
    }

    useEffect(() => {

        fetchInventory().then(data => {

            if (!data || data.length === 0) {
                setError("Inventory is private");
                setLoading(false);
                return;
            }

            // sort the inventory array by price
            data.sort((a, b) => {
                return b.price - a.price;
            });

            setInventory(data);

            let total = 0;
            data.forEach(item => {
                total += parseFloat(item.pricelatest);
            });

            setLoading(false);
            setTotalWorth(total.toFixed(2));
        });

        console.log('#################### USE EFFECT ####################');
    }, []);

    return (
        <main className={`flex min-h-screen flex-col items-center ${inter.className}">`}>
            <Screen>
                <Head>
                    <title>Steam Inventory {profile.personaname}</title>
                    <meta name="description" content="Steam Inventory from {profile.personaname}"/>
                </Head>
                <div className="flex flex-col items-start justify-center w-full bg-gray-800">
                    <div className="flex flex-col w-full px-10 pt-10 pb-8 gap-4 justify-start">
                        <div className="flex flex-col lg:flex-row  items-center gap-2 lg:gap-10 text-gray-700">
                            <Link
                                className="btn btn-primary bg-gray-700 border-gray-600 flex flex-row gap-1  rounded w-48"
                                href="/">
                                <ArrowLeftIcon className="w-6 h-6"/>
                                BACK
                            </Link>
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
                                                      className="underline inline">{profile.personaname}</a>
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

                    {!loading && inventory && inventory.length > 0 && (
                        <div className="flex flex-col flex-wrap px-8 justify-start lg:flex-row">
                            {inventory.map((item, index) => (
                                <InventoryItem item={item}/>
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div
                            className="flex flex-col items-center justify-start w-full min-h-screen h-full bg-gray-900">
                            <Spinner size="xl" color='blue.500' className="mt-12"/>
                        </div>
                    )}

                    {!loading && inventory && inventory.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h2 className="text-center text-white text-xl font-bold mt-4">No items found</h2>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center w-full h-full mb-20">
                            <h2 className="text-center text-white text-xl font-bold mt-4">{error}</h2>
                        </div>
                    )}
                </div>
            </Screen>
        </main>
    )
}

export const getServerSideProps = async (context) => {
    const {steamId} = context.params;

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
    return {props: {profile, profileStatus, steamId}}
};
