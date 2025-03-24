import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function extractMeta(data) {
    const commentBlock = '---';
    let firstComment = data.indexOf(commentBlock);
    let secondComment = data.indexOf(commentBlock, firstComment + 1);

    let multilineString = data.substring(firstComment+3, secondComment).trim();

    let lines = multilineString.split('\n');
    let body = lines
        .map(line => {
            let commaPosition = line.indexOf(':');
            let key = line.substring(0, commaPosition);
            let value = line.substring(commaPosition, line.length).replaceAll("'", "\"");
            return '"' + key + '" ' + value;
        })
        .map((line, index) => index < lines.length - 1 ? line.trim() + ',' : line.trim())
        .join('\n');

    return JSON.parse('{' + body + '}');
}

function extractBody(data) {
    const commentBlock = '---';
    let secondComment = data.indexOf(commentBlock, data.indexOf(commentBlock) + 1);
    return data.substring(secondComment+3);

}

window.addEventListener('load', function(event) {
    fetch('https://raw.githubusercontent.com/zgr3doo/page/refs/heads/main/test.md')
    .then(response => response.text())
    .then(data => {
        // document.getElementById('content').innerHTML = marked.parse(data);
        // console.log(data)

        let meta = extractMeta(data);

        console.log(meta);

        let body = extractBody(data);

        console.log(body);
        
        var md = window.markdownit();
        document.getElementById('page-content').innerHTML = md.render(body);
    });



});

