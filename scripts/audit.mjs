import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const findings=[];let count=0;
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/gh[pousr]_[A-Za-z0-9]{30,}/,/github_pat_[A-Za-z0-9_]{30,}/,/AKIA[A-Z0-9]{16}/,/(?:api_key|access_token|client_secret)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}/i,/https?:\/\/(?:192\.168\.|10\.\d+\.|172\.(?:1[6-9]|2\d|3[01])\.)/];
function scan(name,data){count++;for(const re of patterns)if(re.test(data)) findings.push(`${name}: suspicious secret or private address pattern`);}
function walk(dir){for(const name of readdirSync(dir)){if(['node_modules','.git','.tools','test-results'].includes(name))continue;const p=join(dir,name);if(statSync(p).isDirectory())walk(p);else{if(/\.(exe|ipa|dll|p12|pem|key|sqlite3?|db|cer|env)$/i.test(name))findings.push(`${p}: prohibited artifact`);scan(p,readFileSync(p,'utf8'));}}}
walk('.');
try{const objects=execFileSync('git',['rev-list','--objects','--all'],{encoding:'utf8'}).trim().split('\n');for(const line of objects){const [sha,...path]=line.split(' ');if(!path.length)continue;const type=execFileSync('git',['cat-file','-t',sha],{encoding:'utf8'}).trim();if(type==='blob')scan(`history:${path.join(' ')}`,execFileSync('git',['cat-file','-p',sha],{encoding:'utf8'}));}}catch{findings.push('Git history unavailable; initialize and commit before final audit.');}
console.log(JSON.stringify({scanned:count,findings,scope:'Working files (excluding dependencies/tooling) and reachable Git blobs. Pattern scan is not a guarantee; manual review required.'},null,2));if(findings.length)process.exitCode=1;
