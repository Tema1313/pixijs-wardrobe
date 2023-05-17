import * as PIXI from 'pixi.js';
import WardrobeElement, { IInfoAboutElement } from './WardrobeElement';
import EventEmmiter from './EventEmitter';
import { IWardrobeInterface } from './WardrobeReact';

export default class WardrobeContainer {
    app: PIXI.Application<HTMLCanvasElement>

    //Конструктор с рекурсией
    constructor(props: IWardrobeInterface) {
        this.app = new PIXI.Application<HTMLCanvasElement>({ background: "#FFFFFF", width: 2000, height: 10000 });
        //Создаем контейнер
        const container = new PIXI.Container();
        //Создаем наблюдателя за событиями
        const eventEmmiter = new EventEmmiter()
        // Находим базовый элемент(с параметрами set1 и set2)
        const baseElement: IInfoAboutElement = props.data.find(element => element.set1 && element.set2)
        new WardrobeElement(baseElement, container, props.data, null, eventEmmiter, props.onSelect ? props.onSelect : null)
        // container.scale.x = 0.7
        // container.scale.y = 0.7
        // container.pivot.x = 0.7
        // container.pivot.y = 0.7
        this.app.stage.addChild(container);
    }
}