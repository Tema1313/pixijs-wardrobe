import WardrobeElement from "./WardrobeElement";

export default class EventEmmiter {
    activeId: number
    subscribes: WardrobeElement[]

    constructor(){
        this.activeId = -1
        this.subscribes = []
    }

    setNewActiveId(activeId: number){
        this.activeId = activeId
        this.notifyAll()
    }

    notifyAll(){
        return this.subscribes.forEach(subs => subs.changeLineStyle(this.activeId))
    }

    register(observer: WardrobeElement){
        this.subscribes.push(observer)
    }

    returnAll(){
        console.log(this.subscribes)
    }
}