import * as PIXI from "pixi.js"
// import { IInfoAboutElement } from "./WardrobeElementWithoutRecursion";
import { IInfoAboutElement } from "./WardrobeElement"

export default class GridWardrobeElement{
    constructor(element: IInfoAboutElement, elementWardrobe: PIXI.Graphics, heightContainer: number, widthContainer: number){
        //grid в данном контейнере
        if (element.inner_un > 0) {
            //Если внутренних юнитов больше, чем 0(т.е. хотя бы 1, то делим контейнер на нужное количество частей)
            const heightUnit = heightContainer / element.inner_un
            element.customProps = {
                ...element.customProps,
                heightUnit: heightUnit
            }
            let lineCoordY = element.customProps.coordY
            for (let i = 0; i < element.inner_un; i++) {
                //создаем графику для линии
                const lineGraphics = new PIXI.Graphics();
                //Обводка контейнера
                lineGraphics.lineStyle(1, "#000000");
                //Отрисовываем данный контейнер
                lineGraphics.drawRect(element.customProps.coordX, lineCoordY, widthContainer, 0);
                elementWardrobe.addChild(lineGraphics)
                lineCoordY += heightUnit
            }
            //отрисовка линий в юнитах
            if (element.div_h > 1) {
                const div_hElement = heightUnit / element.div_h
                let lineCoordY = element.customProps.coordY
                for (let i = 0; i <= element.inner_un * element.div_h; i++) {
                    //создаем графику для линии
                    const lineGraphics = new PIXI.Graphics();
                    //Обводка контейнера
                    lineGraphics.lineStyle(1, "#000000");
                    //Отрисовываем данный контейнер
                    lineGraphics.drawRect(element.customProps.coordX, lineCoordY, widthContainer, 0);
                    elementWardrobe.addChild(lineGraphics)
                    lineCoordY += div_hElement
                }
            }
        }
        if (element.div_v > 0) {
            //Если делений контейнера по ширине больше, чем 1(т.е. хотя бы 2, то делим контейнер на нужное количество частей)
            const widthUnit = widthContainer / element.div_v
            element.customProps = {
                ...element.customProps,
                widthUnit: widthUnit
            }
            let lineCoordX = element.customProps.coordX
            for (let i = 0; i < element.div_v; i++) {
                //создаем графику для линии
                const lineGraphics = new PIXI.Graphics();
                //Обводка контейнера
                lineGraphics.lineStyle(1, "#000000");
                //Отрисовываем данный контейнер
                lineGraphics.drawRect(lineCoordX, element.customProps.coordY, 0, heightContainer);
                elementWardrobe.addChild(lineGraphics)
                lineCoordX += widthUnit
            }
        }
    }
}