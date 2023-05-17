import * as PIXI from 'pixi.js';
import GridWardrobeElement from './GridWardrobeElement';
import EventEmmiter from './EventEmitter';

export interface IInfoAboutElement {
    un_id: number,
    stoika_id: number,
    un_parent_id: number,
    obj_id?: number,
    obj_typ?: number,
    ustr_name?: string,
    pos_x: number,
    pos_y: number,
    div_h: number,
    div_v: number,
    un_height: number,
    un_width: number,
    out_of_stoika: number,
    datev: string,
    datemodif: string,
    username: string,
    fu: number,
    treeobjtyp_kod: number,
    treeobjtyp_name: string,
    inner_un: number,
    col: string,
    has_childs: number,
    flag_ex: number,
    rh_id: number,
    set1?: number,
    set2?: number,
    rh_numb: string,
    can_edit: number,
    shablon_id?: number,
    shablon_name: string,
    unh: number,
    show_in_mode: number,
    customProps?: ICustomPropsElementWardrobe
}

export interface ICustomPropsElementWardrobe {
    baseWidth?: number,
    baseHeight?: number,
    heightChildElements?: number,
    coordX?: number,
    coordY?: number,
    containerPixi?: PIXI.Container,
    graphicsPixi?: PIXI.Graphics,
    heightUnit?: number,
    widthUnit?: number,
    color?: string
}

export default class WardrobeElement {
    elementWardrobe: PIXI.Graphics
    elementWardrobeContainer: PIXI.Container
    infoAboutElement: IInfoAboutElement
    //Высота внутреннего контейнера с текстом у контейнера, у которого есть дети
    innerContainerHeight: number

    constructor(
        element: IInfoAboutElement,
        baseContainer: PIXI.Container,
        arrayElements: IInfoAboutElement[],
        parentElement?: IInfoAboutElement,
        eventEmmiter?: EventEmmiter,
        onSelect?: () => void
    ) {
        this.elementWardrobeContainer = new PIXI.Container()
        this.elementWardrobe = new PIXI.Graphics()
        this.infoAboutElement = element
        this.innerContainerHeight = 15

        //Определяем, базовый ли это контейнер
        if (element.set1 && element.set2) {
            //Обводка контейнера
            this.elementWardrobe.lineStyle(1, "#000000");
            //Определяем цвет и закрашиваем контейнер
            const color = element.col.slice(2)
            this.elementWardrobe.beginFill(color);
            element.customProps = {
                ...element.customProps,
                color: color
            }
            // Определяем ширину базового контейнера
            const baseWidth = element.un_width * element.set1 * element.set2
            element.customProps = {
                ...element.customProps,
                baseWidth: baseWidth
            }
            //Определяем высоту базового контейнера
            const baseHeight = element.un_height * element.set1
            element.customProps = {
                ...element.customProps,
                baseHeight: baseHeight
            }
            //Координаты базового контейнера
            element.customProps = {
                ...element.customProps,
                coordX: 1,
                coordY: 0
            }
            //Возвращаем id элемента по клику
            this.elementWardrobe.interactive = true
            this.elementWardrobe.cursor = "pointer"
            //Определяем количество элементов внутри контейнера
            const heightChildElements = baseHeight / element.inner_un
            element.customProps = {
                ...element.customProps,
                heightChildElements: heightChildElements
            }
            eventEmmiter.register(this)
            this.elementWardrobe.on("click",
                onSelect ? onSelect : () => {
                    eventEmmiter.setNewActiveId(element.un_id)
                    console.log(element.un_id)
                }
            )

            // Отрисовываем данный контейнер
            this.elementWardrobe.drawRect(1, 1, baseWidth, baseHeight);

            element.customProps = {
                ...element.customProps,
                graphicsPixi: this.elementWardrobe
            }
            this.elementWardrobeContainer.addChild(this.elementWardrobe)
            element.customProps = {
                ...element.customProps,
                containerPixi: this.elementWardrobeContainer
            }

            //grid в данном контейнере
            new GridWardrobeElement(element, this.elementWardrobe, baseHeight, baseWidth)

            baseContainer.addChild(this.elementWardrobeContainer)

            //Определяем, есть ли дети, и если есть, то вызываем конструктор
            arrayElements.map(possibileChild => {
                if (element.un_id === possibileChild.un_parent_id && element.has_childs !== 0 && !possibileChild.set1 && !possibileChild.set2) {
                    new WardrobeElement(possibileChild, element.customProps.containerPixi, arrayElements, element, eventEmmiter, onSelect ? onSelect : null)
                }
            })
        }
        //Если не базовый 
        else {
            let containerWidth = 0
            //Обводка контейнера
            this.elementWardrobe.lineStyle(1, "#000000");
            //Определяем цвет и закрашиваем контейнер
            const color = element.col.slice(2)
            this.elementWardrobe.beginFill(color);
            element.customProps = {
                ...element.customProps,
                color: color
            }
            //Возвращаем id элемента по клику
            this.elementWardrobe.interactive = true
            this.elementWardrobe.cursor = "pointer"
            //Определяем ширину контейнера
            if (parentElement.div_v !== 0) {
                containerWidth = (parentElement.customProps.baseWidth * element.un_width) / parentElement.div_v
            }
            element.customProps = {
                ...element.customProps,
                baseWidth: containerWidth
            }
            //Определяем высоту контейнера
            const containerHeight = parentElement.customProps.heightChildElements * element.un_height
            element.customProps = {
                ...element.customProps,
                baseHeight: containerHeight
            }
            //Определяем координату по оси x для элемента и для потомков
            let coordX = parentElement.customProps.widthUnit * element.pos_x
            if (coordX === 0) {
                coordX = 1
            }
            element.customProps = {
                ...element.customProps,
                coordX: coordX
            }
            let coordY = 1
            if (parentElement.fu === 0) {
                //Вычисляем координату по оси Y при обратном порядке элементов 
                if (parentElement.customProps.coordY) {
                    coordY = parentElement.customProps.coordY + ((element.pos_y - 1 <= 0 ? 0 : element.pos_y - 1) * parentElement.customProps.heightUnit)
                } else {
                    coordY = parentElement.customProps.baseHeight - ((element.pos_y + 1) * parentElement.customProps.heightUnit)
                }
                element.customProps = {
                    ...element.customProps,
                    coordY: coordY
                }
            } else {
                //Вычисляем координату по оси Y при прямом порядке элементов 
                if (parentElement.customProps.coordY) {
                    coordY = parentElement.customProps.coordY + parentElement.customProps.heightUnit * element.pos_y
                } else {
                    coordY = ((element.pos_y) * parentElement.customProps.heightUnit)
                }
                element.customProps = {
                    ...element.customProps,
                    coordY: coordY
                }
            }

            //Отрисовываем данный контейнер
            this.elementWardrobe.drawRect(coordX, coordY, containerWidth, containerHeight);
            eventEmmiter.register(this)
            this.elementWardrobe.on("click",
                onSelect ? onSelect : () => {
                    eventEmmiter.setNewActiveId(element.un_id)
                    console.log(element.un_id)
                }
            )
            //Если есть дети, то имя располагаем в отдельном контейнере
            if (element.has_childs) {
                //создаем графику для контейнера
                const innerGraphics = new PIXI.Graphics();
                //Обводка контейнера
                innerGraphics.lineStyle(1, "#000000");
                element.customProps = {
                    ...element.customProps,
                    coordY: element.customProps.coordY + this.innerContainerHeight
                }
                //Для потомков создаем ширину и высоту элемента
                const baseHeight = containerHeight - this.innerContainerHeight
                element.customProps = {
                    ...element.customProps,
                    baseHeight: baseHeight
                }
                const baseWidth = containerWidth
                element.customProps = {
                    ...element.customProps,
                    baseWidth: baseWidth
                }
                //Определяем высоту элементов внутри контейнера
                const heightChildElements = baseHeight / element.inner_un
                element.customProps = {
                    ...element.customProps,
                    heightChildElements: heightChildElements
                }
                //Создаем текст и центрируем его
                const text = new PIXI.Text(element.ustr_name, { fontSize: 12 })
                text.x = containerWidth / 2
                text.y = coordY + this.innerContainerHeight / 2
                text.anchor.set(0.5)
                //Отрисовываем данный контейнер
                innerGraphics.drawRect(coordX, coordY, containerWidth, this.innerContainerHeight);
                //Добавляем текст в контейнер
                innerGraphics.addChild(text)
                this.elementWardrobe.addChild(innerGraphics)

                //grid в данном контейнере
                new GridWardrobeElement(element, this.elementWardrobe, baseHeight, baseWidth)
            } else {
                //Если детей нет
                //Создаем текст и центрируем его
                const text = new PIXI.Text(element.ustr_name, { fontSize: 12 })
                text.x = coordX + containerWidth / 2
                text.y = coordY + containerHeight / 2
                text.anchor.set(0.5)
                if (containerHeight > containerWidth) {
                    text.angle = 90
                }
                this.elementWardrobe.addChild(text)
            }
            element.customProps = {
                ...element.customProps,
                graphicsPixi: this.elementWardrobe
            }
            this.elementWardrobeContainer.addChild(this.elementWardrobe)
            element.customProps = {
                ...element.customProps,
                containerPixi: this.elementWardrobeContainer
            }
            baseContainer.addChild(this.elementWardrobeContainer)
            //Определяем, есть ли дети, и если есть, то вызываем конструктор
            arrayElements.map(possibileChild => {
                if (element.un_id === possibileChild.un_parent_id && element.has_childs !== 0 && !possibileChild.set1 && !possibileChild.set2) {
                    new WardrobeElement(possibileChild, element.customProps.containerPixi, arrayElements, element, eventEmmiter, onSelect ? onSelect : null)
                }
            })

        }
    }

    changeLineStyle(activeId: number) {
        if (activeId === this.infoAboutElement.un_id) {
            this.elementWardrobe.clear()
            this.elementWardrobe.beginFill(this.infoAboutElement.customProps.color);
            this.elementWardrobe.lineStyle(3, "#000000");
            if (this.infoAboutElement.has_childs) {
                if (this.infoAboutElement.set1 && this.infoAboutElement.set2) {
                    this.elementWardrobe.drawRect(1, 0, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight + this.innerContainerHeight);
                } else {
                    this.elementWardrobe.drawRect(this.infoAboutElement.customProps.coordX, this.infoAboutElement.customProps.coordY - this.innerContainerHeight, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight + this.innerContainerHeight);
                }
            } else {
                this.elementWardrobe.drawRect(this.infoAboutElement.customProps.coordX, this.infoAboutElement.customProps.coordY, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight);
            }
            this.elementWardrobe.endFill()
        } else {
            this.elementWardrobe.clear()
            this.elementWardrobe.lineStyle(1, "#000000");
            this.elementWardrobe.beginFill(this.infoAboutElement.customProps.color)
            if (this.infoAboutElement.has_childs) {
                if (this.infoAboutElement.set1 && this.infoAboutElement.set2) {
                    this.elementWardrobe.drawRect(1, 0, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight + this.innerContainerHeight);
                } else {
                    this.elementWardrobe.drawRect(this.infoAboutElement.customProps.coordX, this.infoAboutElement.customProps.coordY - this.innerContainerHeight, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight + this.innerContainerHeight);
                }
            } else {
                this.elementWardrobe.drawRect(this.infoAboutElement.customProps.coordX, this.infoAboutElement.customProps.coordY, this.infoAboutElement.customProps.baseWidth, this.infoAboutElement.customProps.baseHeight);
            }
            this.elementWardrobe.endFill()
        }
    }
}