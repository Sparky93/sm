import axios from "axios";
import { YoutubeModel } from "../../models/YoutubeModel";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import TopNavbar from "../../components/TopNavbar";
import Footer from "../../components/Footer";
import Cookies from "cookies";
import YoutubeTokenHelper from "../../utils/YoutubeTokenHelper";
import { server } from "../../config";
import TemplatePage from "../../components/TemplatePage";
import { StateMachineManager } from "./StateMachineManager";

const StateMachinePage = ({ isAuthed, youtubeModel }) => {
    let [builder, setBuilder] = useState(null)

    useEffect(() => {
        let model: YoutubeModel = YoutubeModel.makeFromOther(youtubeModel)
        StateMachineManager.observeRenderer(model, setBuilder)
    }, [youtubeModel])

    return (<div className="bg-gray-800 min-h-screen">
        <TopNavbar isAuthed={isAuthed} />
        <div className="flex flex-col items-center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col justify-center items-center">
                <div className="text-white font-bold max-w-sm rounded overflow-hidden shadow-lg">
                    <TemplatePage {...builder?.build()} />
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
    youtubeModel.currentUserChannelId = "channelId_0"
    youtubeModel.currentUserBlockchainId = "blockchain_1"
    youtubeModel.blockchainOwner = null//"blockchain_0"
    youtubeModel.gotOffers = false
    youtubeModel.gotPrice = false
    youtubeModel.gotBids = false

    return { props: { isAuthed, youtubeModel } }
}

export default StateMachinePage;