import fs from 'fs';
import path from 'path';

const rootDir = process.argv[2];

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.jsx')) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(rootDir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix Components -> components
    let newContent = content.replace(/([\'\"\`])(.*\/)?Components\//g, '$1$2components/');
    // Fix api/ -> services/
    newContent = newContent.replace(/([\'\"\`])(.*\/)?api\//g, '$1$2services/');
    // Fix backbutton -> common/BackButton
    newContent = newContent.replace(/([\'\"\`])(.\/|\.\.\/)*backbutton(?:\.jsx)?([\'\"\`])/g, function(match, p1, p2, p3) {
        p2 = p2 || '';
        // if in components/common/BackButton.jsx, it doesn't need to change but we'll try to guess depth.
        return p1 + p2 + 'common/BackButton' + p3;
    });
    
    // Specific fixes for App.jsx CSS imports
    if (filePath.endsWith('App.jsx') || filePath.endsWith('main.jsx')) {
         newContent = newContent.replace(/([\'\"\`])\.\/App\.css([\'\"\`])/g, '$1./styles/App.css$2');
         newContent = newContent.replace(/([\'\"\`])\.\/index\.css([\'\"\`])/g, '$1./styles/index.css$2');
         newContent = newContent.replace(/([\'\"\`])\.\/custom-scrollbar\.css([\'\"\`])/g, '$1./styles/custom-scrollbar.css$2');
    }

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated imports in ${filePath}`);
    }
});
