export function SMTitle(text: string) {
    return (<div><span>{text}</span></div>)
}

export function SMDescription(text: string) {
    return (<div><span>{text}</span></div>)
}

export function SMActionButton(text: string, onClick) {
    return (<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => onClick()}>{text}</button>)
}

export function SMPrimaryComponent(primaryComponent) {
    return (<div>{primaryComponent}</div>)
}

export function SMSecondaryComponent(secondaryComponent) {
    return (<div>{secondaryComponent}</div>)
}