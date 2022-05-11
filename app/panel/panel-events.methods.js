
export default function () {
    renderChangeEvent.call(this)
    renderClickEvent.call(this)
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (file) {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    } else {
        resolve(null)
    }
})

function renderChangeEvent() {
    const { containerWidthElement, containerHeightElement, cellSizeElement, imageImportElement, fileImportElement, gridElement, gridPathElement, gridDraw } = this

    

    containerWidthElement.addEventListener('change', _ => {
            gridPathElement.value = null
            fileImportElement.value = null
            location.reload()
    })
    containerHeightElement.addEventListener('change', _ => {
            gridPathElement.value = null
            fileImportElement.value = null
            location.reload()
    })
    cellSizeElement.addEventListener('change', _ => {
            gridPathElement.value = null
            fileImportElement.value = null
            location.reload()
    })

    imageImportElement.addEventListener('click', async _ => {
        const file = imageImportElement.files[0]
        const base64data = await toBase64(file)
        if (base64data) gridElement.style.backgroundImage = `url(${base64data})`
    })

    fileImportElement.addEventListener('change', async _ => {
        const file = fileImportElement.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            
            const fileContent = JSON.parse(reader.result)

            if (fileContent.containerWidth) containerWidthElement.value = fileContent.containerWidth
            if (fileContent.containerHeight) containerHeightElement.value = fileContent.containerHeight
            if (fileContent.cellSize) cellSizeElement.value = fileContent.cellSize
            if (fileContent.imageBackground) gridElement.style.backgroundImage = `url(${fileContent.imageBackground})`
            if (fileContent.grid) gridPathElement.value = JSON.stringify(fileContent.grid)

            gridDraw.draw()

            location.reload() 
        }
        reader.readAsText(file)
    })
}

function renderClickEvent() {
    const { gridElement, fileExportElement, imageImportElement, imageRemoveElement, containerWidthElement, containerHeightElement, cellSizeElement, gridDraw } = this

    fileExportElement.addEventListener('click', async _ => {
        gridDraw.draw()

        const file = imageImportElement.files[0]
        const base64data = await toBase64(file)

        let json = {
            containerWidth: parseInt(containerWidthElement.value),
            containerHeight: parseInt(containerHeightElement.value),
            cellSize: parseInt(cellSizeElement.value),
            imageBackground: base64data,
            grid: gridDraw.helperGrid
        }

        let date = new Date()
        date = [
            date.getFullYear(),
            ('0' + (date.getMonth() + 1)).slice(-2),
            ('0' + date.getDate()).slice(-2),
            ('0' + date.getHours()).slice(-2),
            ('0' + date.getMinutes()).slice(-2)
        ].join('')

        let a = document.createElement("a")
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(json)], { type: "application/json" })
        )
        a.download = `export_pathfinding_${date}.json`
        a.click()
    })

    imageRemoveElement.addEventListener('click', _ => {
        imageImportElement.value = null
        gridElement.style.backgroundImage = null
    })
}