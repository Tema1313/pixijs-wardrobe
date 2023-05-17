import React from "react";
import { IInfoAboutElement } from "./WardrobeElement";
import WardrobeContainer from "./WardrobeContainer";

export interface IWardrobeInterface {
    data: IInfoAboutElement[],
    onSelect?: () => void
}

const checkElementsIdUniq = (arrayData: IInfoAboutElement[]) => {
    arrayData.forEach(element => {
        if(element.un_id === 0 && !element.set1 && !element.set2){
            console.log(element)
            const newId = Math.round(Math.random()*1000)
            element.un_id = newId
            console.log(element)
        }
    })

}

const WardrobeReact = (props: IWardrobeInterface) => {
    checkElementsIdUniq(props.data)
    const app = new WardrobeContainer(props)
    document.body.appendChild(app.app.view);
    document.body.style.margin = "20px"
    return (
        <></>
    )
}

export default WardrobeReact