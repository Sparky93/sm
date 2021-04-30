import React from "react"
import TransactionTable from "../../components/TransactionTable"
import YoutubeVideoPanel from "../../components/YoutubeVideoPanel"

export function SMTitle(text: string) {
    return <div><span>{text}</span></div>
}

export function SMDescription(text: string) {
    return <div><span>{text}</span></div>
}

export function SMActionButton(text: string, onClick) {
    return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onClick()}>{text}</button>
}

export function SMPrimaryComponent(model) {
    return <YoutubeVideoPanel {...model} />
}

export function SMSecondaryComponent() {
    return <div><input type="text" placeholder="$" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-300 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" /></div>
}

export function SMTernaryComponent() {
    return <TransactionTable transactions={[]} />
}