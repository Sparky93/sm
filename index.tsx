import axios from "axios";
import { YoutubeModel } from "../../models/YoutubeModel";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import TopNavbar from "../../components/TopNavbar";
import Footer from "../../components/Footer";
import Cookies from "cookies";
import YoutubeTokenHelper from "../../utils/YoutubeTokenHelper";
import { server } from "../../config";
import { StateMachineManager } from "./StateMachineManager";
import { TemplatePageBuilder } from "./TemplatePageBuilder";
import YoutubeVideoPanel from "../../components/YoutubeVideoPanel";
import TransactionTable from "../../components/TransactionTable";
import TemplatePage from "../../components/TemplatePage";
import { buy, listAtFixedPrice, makeBid, makeOffer, mintAndList, sellByBid, sellByOffer } from "./IMethods";

const StateMachinePage = ({ isAuthed, youtubeModel }) => {
    let model: YoutubeModel = YoutubeModel.makeFromOther(youtubeModel)

    let [builder, setBuilder] = useState(null)
    let [states, setStates] = useState(null)

    useEffect(() => {
        StateMachineManager.observe(model, (states) => {
            let newBuilder = TemplatePageBuilder
                .get()
                .addPrimaryComponent(<YoutubeVideoPanel {...youtubeModel} />)
                .addTernaryComponent(<TransactionTable transactions={[]} />)
            setStates(states)
            for (let state of states) {
                switch (state) {
                    case 'minted':
                        if (states.includes('owned')) {
                            newBuilder.addTitle('You are the owner of this NFT')
                        }
                        break;
                    case 'unminted':
                        if (states.includes('unowned')) {
                            newBuilder
                                .addActionButton("MAKE BID", () => makeBid())
                                .addSecondaryComponent(<div><input type="text" placeholder="$" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-300 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" /></div>)
                        }
                        break;
                    case 'owned': break;
                    case 'unowned':
                        if (states.includes('listed')) {
                            newBuilder
                                .addTitle('This video is listed')
                                .addDescription('COST: 100$ | 0.4 ETH')
                                .addActionButton("BUY", () => buy())
                        } else if (states.includes('unlisted')) {
                            newBuilder
                                .addSecondaryComponent(<div><input type="text" placeholder="$" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-300 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" /></div>)
                                .addActionButton("MAKE AN OFFER", () => makeOffer())
                        }
                        break;
                    case 'listed':
                        // if onlySellTo != null && 
                        if (states.includes('owned')) {
                            newBuilder
                                //.addActionButton('VIEW', () => { /* REDIRECT ON SELLING PANEL */ })
                                .addDescription('LISTED FOR 0.4 ETH')
                        }
                        break;
                    case 'unlisted':
                        if (states.includes('owned') && states.includes('offered')) {
                            newBuilder
                                .addDescription('You\'ve been offered 0.4 ETH by 0x048959FHJSFHJ*&')
                                .addActionButton("SELL", () => sellByOffer())
                        }
                        break;
                    case 'bidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            newBuilder
                                .addTitle('The highest bid is from 0x048959FHJSFHJ*& for 0.4 ETH')
                                .addActionButton("SELL", () => sellByBid())
                        }
                        break
                    case 'unbidded':
                        if (states.includes('unminted') && states.includes('owned')) {
                            newBuilder
                                .addTitle('You can MINT and SELL this')
                                .addSecondaryComponent(<div><input type="text" placeholder="$" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-300 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" /></div>)
                                .addActionButton("MINT & LIST", () => mintAndList())
                        }
                        break;
                    case 'offered': break;
                    case 'unoffered':
                        if (states.includes('unlisted') && states.includes('owned')) {
                            newBuilder
                                .addSecondaryComponent(<div><input type="text" placeholder="$" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-300 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" /></div>)
                                .addActionButton("LIST", () => listAtFixedPrice())
                        }
                        break;
                }
            }
            setBuilder(newBuilder)
        })
    }, [youtubeModel])
    return (<div className="bg-gray-800 min-h-screen">
        <TopNavbar isAuthed={isAuthed} />
        <div className="flex flex-col items-center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col justify-center items-center">
                <div className="text-white font-bold">{JSON.stringify(states)}</div>
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