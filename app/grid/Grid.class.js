import { generateQueryConstructor } from "../utils/object.utils.js"
import GridCell from './GridCell.class.js'
import GridDraw from './GridDraw.class.js'
import renderEvents from "./../panel/panel-events.methods.js"

class Grid {

    constructor() {
        generateQueryConstructor.call(this, ...arguments)
    }

    get gridElement() {
        return document.querySelector( this.settings.gridSelector )
    }

    get svgElement() {
        return document.querySelector( this.settings.svgSelector )
    }

    get containerWidthElement() {
        return document.querySelector( this.settings.containerWidthSelector )
    }

    get containerHeightElement() {
        return document.querySelector( this.settings.containerHeightSelector )
    }

    get cellSizeElement() {
        return document.querySelector( this.settings.cellSizeSelector )
    }

    get imageImportElement() {
        return document.querySelector( this.settings.imageImportSelector )
    }

    get imageRemoveElement() {
        return document.querySelector( this.settings.imageRemoveSelector )
    }

    get fileImportElement() {
        return document.querySelector( this.settings.fileImportSelector )
    }

    get fileExportElement() {
        return document.querySelector( this.settings.fileExportSelector )
    }

    get gridPathElement() {
        return document.querySelector( this.settings.gridPathSelector )
    }

    get gridDraw() {
        return new GridDraw({ grid: this })
    }

    build() {
        this.#buildGridLayout()
        this.#buildGridCells()

        renderEvents.call(this)
    }

    #buildGridLayout() {
        const { settings, gridElement, containerWidthElement, containerHeightElement, cellSizeElement, gridPathElement, gridDraw } = this
        const { cellSize, borderSize, borderColor, containerWidth, containerHeight, imageBackground } = settings

        containerWidthElement.value = containerWidthElement.value ? containerWidthElement.value : containerWidth
        containerHeightElement.value = containerHeightElement.value ? containerHeightElement.value : containerHeight
        cellSizeElement.value = cellSizeElement.value ? cellSizeElement.value : cellSize

        const fullCellSize = parseInt(cellSizeElement.value) + borderSize * 2

        // if (gridPathElement.value) {
        //     const arrayMatrix = JSON.parse(gridPathElement.value)
        //     this.numCols = arrayMatrix[0].length
        //     this.numRows = arrayMatrix.length
        // } else {
            this.numCols = Math.ceil(parseInt(containerWidthElement.value) / fullCellSize)
            this.numRows = Math.ceil(parseInt(containerHeightElement.value) / fullCellSize)
        // }

        this.gridWidth = this.numCols * fullCellSize
        this.gridHeight = this.numRows * fullCellSize

        Object.assign( gridElement.style, {
            width: `${ this.gridWidth }px`,
            height: `${ this.gridHeight }px`,

            border: `${ borderSize }px solid ${ borderColor }`,
        })

    }

    #buildGridCells() {
        const { numRows, numCols, gridPathElement } = this
        
        let arrayMatrix = (gridPathElement.value)? JSON.parse(gridPathElement.value) : []
        let isBlocked = false
        
        this.gridcells = {}

        for ( let row = 0; row < numRows; row++) {
            for ( let col = 0; col < numCols; col++) {
            
                if (gridPathElement.value) isBlocked = arrayMatrix[row][col] == 1
            
                const gridcell = new GridCell({ grid: this, row, col, isBlocked })
                gridcell.render()

                this.gridcells[ gridcell.position ] = gridcell
            }
        }
    }

    draw() {
        const { gridDraw } = this

        gridDraw.draw()
    }
}

export default Grid