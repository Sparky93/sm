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
import { ContractMethods } from "../../ethereum/contractMethods";
import { MetamaskConnection } from "../../ethereum/metamaskConnection";

const StateMachinePage = ({ isAuthed, youtubeModel }) => {
    let [builder, setBuilder] = useState(null)
    let [input, setInput] = useState('')
    let [metamaskAccountAddress, setMetamaskAccountAddress] = useState(null)

    useEffect(() => {
        let model: YoutubeModel = YoutubeModel.makeFromOther(JSON.parse(youtubeModel))
        getMetamaskAccountAddress()
        model.currentUserBlockchainId = metamaskAccountAddress
        StateMachineManager.observeRenderer(model, setBuilder, input, setInput)
    }, [youtubeModel, metamaskAccountAddress])

    async function getMetamaskAccountAddress() {
        const metamaskConnection = new MetamaskConnection(window);
        const account = await metamaskConnection.checkMetamaskAccount();
        setMetamaskAccountAddress(account)
    }

    return (<div className="bg-gray-800 min-h-screen">
        <TopNavbar isAuthed={isAuthed} />
        <div className="flex flex-col items-center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {input}
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

    /**
     * DECORATE THE MODEL WITH BLOCKCHAIN INFORMATIONS
     */
    let youtubeModel: YoutubeModel = await axios.get(`${server}/api/youtube/videos/video-by-id?video_id=rxmJg8_7HiU`)
        .then((response) => YoutubeModel.makeFromOther(response.data))
    const currentUserChannelId = YoutubeTokenHelper.getChannelId(cookies)
    const { token, owner } = await ContractMethods.getTokenAndOwner(youtubeModel.getVideoId())
    //youtubeModel.currentUserBlockchainId = await getMetamaskAccountAddress()
    youtubeModel.currentUserChannelId = currentUserChannelId
    youtubeModel.blockchainOwner = owner
    youtubeModel.tokenId = token
    youtubeModel.gotOffers = await ContractMethods.getOffer(youtubeModel.tokenId) != null
    youtubeModel.gotPrice = false
    youtubeModel.gotBids = null//await ContractMethods.getBid(youtubeModel.tokenId) != null

    return { props: { isAuthed, youtubeModel: JSON.stringify(youtubeModel) } }
}

export default StateMachinePage;