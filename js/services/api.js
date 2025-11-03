const API = {
base: '/api', // ajusta si tu backend vive en otra ruta o puerto
async post(path, data){
const res = await fetch(`${this.base}${path}`,{
method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
});
if(!res.ok){ throw new Error(`HTTP ${res.status}`); }
return res.json();
},
async get(path){
const res = await fetch(`${this.base}${path}`);
if(!res.ok){ throw new Error(`HTTP ${res.status}`); }
return res.json();
}
};