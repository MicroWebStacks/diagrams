async function genAsync(){
    const diagramSelector = document.getElementById('diagramSelector').value;
    const diagramSource = document.getElementById('diagramSource').value;
    //console.log(diagramSource)

    const data = new TextEncoder('utf-8').encode(diagramSource);
    const compressed = pako.deflate(data, { level: 9, to: 'string' }) 
    const result = btoa(compressed).replace(/\+/g, '-').replace(/\//g, '_')

    var url = baseURL + diagramSelector + '/svg/' + result;
    console.log(url)
    const response = await fetch(url);
    const svgContent = await response.text();    
    //console.log(svgContent)
    const svgContainer = document.getElementById('svgcontainer');

    const old_svg = document.getElementsByTagName("svg")
    //console.log(old_svg)
    if(old_svg.length){
        old_svg[0].remove()
    }
    svgContainer.innerHTML = svgContent;
}

function generateDiagram() {
    genAsync().then()
}

function updateExample(){
    let diagSelector = document.getElementById("diagramSelector")
    let textarea = document.getElementById("diagramSource")
    //console.log(diagSelector.value)
    textarea.value = examples[diagSelector.value]
    generateDiagram()
}

function export_svg(){
    const svg_element = document.querySelector("svg")
    //console.log(svg_element)
    let s = new XMLSerializer();
    const svg_str = s.serializeToString(svg_element);
    var blob = new Blob([svg_str], {type: 'image/svg+xml'});
    let diagSelector = document.getElementById("diagramSelector")
    saveAs(blob,`${diagSelector.value}`);
}

function init(){
    let generate = document.getElementById("generate")
    generate.onclick = generateDiagram
    let diagSelector = document.getElementById("diagramSelector")
    diagSelector.onchange = updateExample
    updateExample()
    let export_button = document.getElementById("save")
    export_button.onclick = export_svg

}

init()
