const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('_Analysis.puml')) results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/trinh/Downloads/NaviMart/diagrams');

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('<<boundary>>') && content.includes('class ')) {
        continue;
    }

    let title = '';
    let nodes = {}; // alias -> { type, name, methods: new Set() }
    let connections = new Set();
    
    let titleMatch = content.match(/title\s+(.+)/);
    if (titleMatch) {
        title = titleMatch[1].replace(/\(Robustness\)/ig, 'Class').replace(/Robustness/ig, 'Class');
        if (!title.includes('Class Diagram')) {
            title = title.replace(/Analysis Diagram/i, 'Analysis Class Diagram');
        }
    }
    
    let nodeRegex = /(boundary|control|entity|actor)\s+"([^"]+)"\s+as\s+(\w+)/g;
    let match;
    while ((match = nodeRegex.exec(content)) !== null) {
        nodes[match[3]] = { type: match[1], name: match[2], methods: new Set() };
    }
    let nodeRegex2 = /(boundary|control|entity|actor)\s+(\w+)\s+as\s+(\w+)/g;
    while ((match = nodeRegex2.exec(content)) !== null) {
        if (!nodes[match[3]]) {
            nodes[match[3]] = { type: match[1], name: match[2], methods: new Set() };
        }
    }
    let nodeRegex3 = /^\s*(boundary|control|entity|actor)\s+"?([^"\s]+)"?\s*$/gm;
    while ((match = nodeRegex3.exec(content)) !== null) {
        let alias = match[2];
        if (!nodes[alias]) {
            nodes[alias] = { type: match[1], name: match[2], methods: new Set() };
        }
    }

    let interactionRegex = /^(\w+)\s*-->?\s*(\w+)\s*(?::\s*(.+))?$/gm;
    while ((match = interactionRegex.exec(content)) !== null) {
        let from = match[1];
        let to = match[2];
        let text = match[3] || '';
        
        if (nodes[from] && nodes[from].type !== 'actor' && nodes[to] && nodes[to].type !== 'actor') {
            let conn = [from, to].sort().join(' -- ');
            connections.add(conn);
        }
        
        if (nodes[to] && nodes[to].type !== 'actor' && text.trim()) {
            let parts = text.split(/\\n|;/);
            for (let part of parts) {
                part = part.trim();
                if (!part) continue;
                part = part.replace(/^[\d\.]+\s*/, '').trim();
                if (!part) continue;
                
                let methodSig = part;
                if (!methodSig.includes('(')) methodSig += '()';
                if (!methodSig.includes(':')) methodSig += ' : void';
                if (methodSig.endsWith(')') && !methodSig.includes(':')) methodSig += ' : void';
                
                nodes[to].methods.add('+ ' + methodSig);
            }
        }
    }
    
    let newContent = `@startuml\n`;
    if (title) {
        newContent += `title ${title}\n\n`;
    } else {
        newContent += `title Analysis Class Diagram\n\n`;
    }
    
    for (let alias in nodes) {
        let node = nodes[alias];
        if (node.type === 'actor') continue;
        
        newContent += `class "${node.name}" as ${alias} <<${node.type}>> {\n`;
        for (let method of node.methods) {
            newContent += `  ${method}\n`;
        }
        newContent += `}\n`;
    }
    
    newContent += `\n`;
    for (let conn of connections) {
        newContent += `${conn}\n`;
    }
    
    newContent += `@enduml\n`;
    
    console.log(`===== ${file} =====\n${newContent}`);
    break; // only print first file
}
