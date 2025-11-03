const $ = (sel,root=document)=>root.querySelector(sel);
const $$ = (sel,root=document)=>[...root.querySelectorAll(sel)];
function toast(msg, type='info'){ const el=$('#toast'); $('#toast-text').textContent=msg; $('#toast-icon').textContent= type==='ok'?'✅': type==='err'?'❌':'ℹ️'; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }