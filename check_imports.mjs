import fs from 'fs';
import path from 'path';

function checkDir(d) {
    fs.readdirSync(d).forEach(f => {
        let p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) {
            checkDir(p);
        } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
            let c = fs.readFileSync(p, 'utf8');
            let m = c.match(/(?:import\s+.*?from\s+|import\s+)['"](.*?)['"]/g) || [];
            m.forEach(imp => {
                let rel = imp.split(/['"]/)[1];
                if (rel && rel.startsWith('.')) {
                    let tgt = path.join(path.dirname(p), rel);
                    if (!fs.existsSync(tgt) && 
                        !fs.existsSync(tgt + '.jsx') && 
                        !fs.existsSync(tgt + '/index.jsx') && 
                        !fs.existsSync(tgt + '.js') && 
                        !fs.existsSync(tgt + '.css')) {
                        console.log('BROKEN:', p, '->', rel);
                    }
                }
            });
        }
    });
}
checkDir('./src');
