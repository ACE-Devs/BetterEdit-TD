var b = []
let blockpick = -1

let selected = -1
let cameraX = 0
let cameraY = 0
let blockRot = 0
let levelName = ""
const menuElement = document.querySelector("#menu")
const editorElement = document.querySelector("#editor")
const selectionElement = document.querySelector("#blocks")
const selectMenu = document.querySelector("#selectMenu")

function previewFile() {
    const [file] = document.querySelector("#open").files;
    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
            // this will then display a text file
            loadLevel(reader.result);

        },
        false,
    );

    if (file) {
        reader.readAsText(file);
    }
}

function loadLevel(data) {
    data = data.split("§")
    data = data[3]
    data = data.split(":")
    data.splice(0, 2)
    b = []
    for (let i = 0; i < data.length; i += 3) {
        var id = data[i].split(";")[0].slice(1)
        var rot = data[i + 2].split(";")[0].slice(1)
        var x = data[i + 1].split(",")[0].slice(2)
        var y = data[i + 1].split(")")[0].split(" ")[2]
        let entry = [int(id), (float(x) + 12) * 40, (float(y) + 6) * 40, int(rot)]
        if (id != 8) {
            b.push(entry)
        }
    }
}

const height = roundToNearest(editorElement.offsetHeight, 40)

function setup() {
    if (window.location.href.split("?")[1] == "new=1") {
        levelName = prompt("level name?")
    }
    else {
        if (window.location.href.split("?")[1].includes("open=")) {
            let key = window.location.href.split("?")[1].split("=")[1]
            if (key.includes("+")) { n = key.split("+").join(" ") } else { n = key }
            levelName = n
            loadLevel(window.localStorage.getItem(key))
        }
    }
    let cnv = createCanvas(editorElement.offsetWidth, editorElement.offsetHeight);
    cnv.parent("editor")
    images = [loadImage('block.png'), loadImage('spike.png'), loadImage('yellow orb.png'), loadImage("pink orb.png"), loadImage("blue orb.png"), loadImage("green orb.png"), loadImage("yellow portal.png"), loadImage("blue portal.png")];
    menu = ["block.png", "spike.png", "yellow orb.png", "pink orb.png", "blue orb.png", "green orb.png", "yellow portal.png", "blue portal.png"]
    ground = loadImage("gorund.png")
    player = loadImage("player.png")
    renderMenu()
}

function image_(img, img_x, img_y, img_width, img_height, img_angle) {
    imageMode(CENTER);
    translate(img_x + img_width / 2, img_y + img_width / 2);
    rotate(PI / 180 * img_angle);
    image(img, 0, 0, img_width, img_height);
    rotate(-PI / 180 * img_angle);
    translate(-(img_x + img_width / 2), -(img_y + img_width / 2));
    imageMode(CORNER);
}

function draw() {
    background(49, 77, 121);
    if (blockpick != -1) {
        if (blockpick == 7 || blockpick == 6) {
            imageMode(CENTER)
            image_(images[blockpick], roundToNearest(mouseX, 40), roundToNearest(mouseY, 40), 40, 120, blockRot)
            imageMode(CORNER)
        } else {
            image_(images[blockpick], roundToNearest(mouseX, 40), roundToNearest(mouseY, 40), 40, 40, blockRot)
        }
    }

    if (keyIsPressed === true) {
        if (key === "a") {
            cameraX -= 100
        } else if (key === 'd') {
            cameraX += 100
        }
    }

    if (selected != -1) {
        blockSelectionMenu()
    }

    for (let i = 0; i < b.length; i++) {
        const element = b[i]
        if (selected == i) { tint(0, 255, 0); }
        if (element[0] == 7 || element[0] == 6) {
            imageMode(CENTER)
            image_(images[element[0]], element[1] - cameraX, (height - element[2]), 40, 120, element[3])
            imageMode(CORNER)
        } else {
            image_(images[element[0]], element[1] - cameraX, (height - element[2]), 40, 40, element[3])
        }
        tint(255, 255, 255)
    }

    image(ground, 0, height - 40, 400, 40)
    image(ground, 400, height - 40, 400, 40)
    image(ground, 800, height - 40, 400, 40)
    image(ground, 1200, height - 40, 400, 40)
    image(player, -cameraX, height - 80, 40, 40)
}

function roundToNearest(a, b) {
    let x = a % b
    a = a - x
    return a
}

function mouseClicked() {
    if (blockpick != -1) {
        // placing blocks
        if (mouseX < editorElement.offsetWidth && mouseY < editorElement.offsetHeight) {
            let x = roundToNearest(mouseX, 40)
            let y = roundToNearest(mouseY, 40)
            b.push([blockpick, x + cameraX, height - y, blockRot])
        }
    } else {
        if (blockpick == -1) {
            let mx = mouseX
            let my = mouseY
            for (let i = 0; i < b.length; i++) {
                const block = b[i];
                if (block[1] < (mx + cameraX) & (block[1] + 40) > (mx + cameraX)) {
                    if ((height - block[2]) < my & ((height - block[2]) + 40) > my) {
                        selected = i
                        break
                    }
                }
            }
        }
    }
}

function renderMenu() {
    for (let i = 0; i < menu.length; i++) {
        menuElement.innerHTML += `<button class="block" onclick="blockpick = ${i}"><img src="${menu[i]}" width=40 height=40></button>`
    }
}

function saveLevel() {
    let savedata = `song: §
artist: §
creator: §
level: {
`
    for (let i = 0; i < b.length; i++) {
        const element = b[i];
        savedata = savedata + `id: ${element[0]}; pos: (${(element[1] / 40) - 12}, ${(element[2] / 40) - 6}); rot: ${element[3]};\n`
    }
    if (levelName.includes(" ")) { n = levelName.split(" ").join("+") } else { n = levelName }
    savedata += "}\n"
    window.localStorage.setItem(n, savedata)
    console.log(savedata)
}

function blockSelectionMenu() {

}