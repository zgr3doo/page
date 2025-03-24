import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const prefix = '/page';
// const prefix = '';

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
        let meta = extractMeta(data);
        let body = extractBody(data);
        var md = window.markdownit();
        document.getElementById('page-content').innerHTML = md.render(body);
    });

    fetch(prefix + '/menu.json')
    .then(response => response.json())
    .then(data => {
        let menu = data.map(element => '<li><a href="' + prefix + '/beta?page=' + element.url + '">' + element.key + '</a></li>').join('\n');
        document.getElementById('menu').innerHTML = '<li class="active"><a>View All</a></li>\n' + menu;
    });



});

