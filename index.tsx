import axios from "axios";
import { YoutubeModel } from "../../models/YoutubeModel";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import TopNavbar from "../../components/TopNavbar";
import Footer from "../../components/Footer";
import Cookies from "cookies";
import YoutubeTokenHelper from "../../utils/YoutubeTokenHelper";
import { server } from "../../config";
import { StateMachineFactory } from "./StateMachineFactory";
import { StateMachineManager } from "./StateMachineManager";

const StateMachinePage = ({ isAuthed, youtubeModel }) => {
    let model: YoutubeModel = YoutubeModel.makeFromOther(youtubeModel)

    StateMachineManager.observe(model, (state) => {
        switch (state) {
            default:
                console.log(state)
            case 'minted':
                break
            case 'unminted':
                break
            case 'owned':
                break
            case 'unowned':
                break
            case 'listed':
                break
            case 'unlisted':
                break
            case 'bidded':
                break
            case 'unbidded':
                break
        }
    })

    return (<div className="bg-gray-800 min-h-screen">
        <TopNavbar isAuthed={isAuthed} />
        <div className="flex flex-col items-center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col justify-center items-center">
                <div className="text-white font-bold max-w-sm bg-purple-700 rounded overflow-hidden shadow-lg">

                </div>
            </main>
            <Footer></Footer>
        </div>
    </div>)
}

export const getServerSideProps = async (context) => {
    const cookies = new Cookies(context.req, context.res)
    const isAuthed = YoutubeTokenHelper.isAuthed(cookies)

    let youtubeModel: YoutubeModel = await axios.get(`${server}/api/youtube/videos/video-by-id?video_id=rxmJg8_7HiU`)
        .then((response) => response.data)

    /**
     * ADD TEST DATA TO THE MODEL SO WE CAN TEST CASES
     */
    youtubeModel.channelId = "channelId_1"
    youtubeModel.currentUserChannelId = "channelId_1"
    youtubeModel.currentUserBlockchainId = "blockchain_1"
    youtubeModel.blockchainOwner = null
    youtubeModel.offersSize = 0
    youtubeModel.transactionsSize = 0

    return { props: { isAuthed, youtubeModel } }
}

export default StateMachinePage;