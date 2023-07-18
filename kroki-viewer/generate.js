const examples={
    actdiag:`actdiag {
write -> convert -> image

    lane user {
        label = "User"
        write [label = "Writing reST"];
        image [label = "Get diagram IMAGE"];
    }
    lane actdiag {
        convert [label = "Convert reST to Image"];
    }
}
`,
    blockdiag:`blockdiag {
    blockdiag -> generates -> "block-diagrams";
    blockdiag -> is -> "very easy!";

    blockdiag [color = "greenyellow"];
    "block-diagrams" [color = "pink"];
    "very easy!" [color = "orange"];
}
`,
seqdiag:`seqdiag {
    browser  -> webserver [label = "GET /index.html"];
    browser <-- webserver;
    browser  -> webserver [label = "POST /blog/comment"];
    webserver  -> database [label = "INSERT comment"];
    webserver <-- database;
    browser <-- webserver;
}`,
nwdiag:`nwdiag {
    network dmz {
        address = "210.x.x.x/24"

        web01 [address = "210.x.x.1"];
        web02 [address = "210.x.x.2"];
    }
    network internal {
        address = "172.x.x.x/24";

        web01 [address = "172.x.x.1"];
        web02 [address = "172.x.x.2"];
        db01;
        db02;
    }
}`,
mermaid:`graph TD
A[ Anyone ] -->|Can help | B( Go to github.com/yuzutech/kroki )
B --> C{ How to contribute? }
C --> D[ Reporting bugs ]
C --> E[ Sharing ideas ]
C --> F[ Advocating ]
`
}

async function genAsync(){
    const diagramSelector = document.getElementById('diagramSelector').value;
    const diagramSource = document.getElementById('diagramSource').value;
    //console.log(diagramSource)
    // Encode the diagram definition in Base64
    const data = new TextEncoder('utf-8').encode(diagramSource);
    const compressed = pako.deflate(data, { level: 9, to: 'string' }) 
    const result = btoa(compressed).replace(/\+/g, '-').replace(/\//g, '_')
    // Generate the URL for the Kroki API
    var url = 'https://kroki.io/' + diagramSelector + '/svg/' + result;
    //var url = 'http://localhost:7000/' + diagramSelector + '/svg/' + result;
    console.log(url)
    const response = await fetch(url);
    const svgContent = await response.text();    
    //console.log(svgContent)
    const svgContainer = document.getElementById('svgcontainer');
    //remove old
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
