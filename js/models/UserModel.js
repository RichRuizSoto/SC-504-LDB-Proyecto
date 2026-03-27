const UserModel = {
session: null,
setSession(s){ this.session = s; localStorage.setItem('session', JSON.stringify(s)); },
load(){ try{ this.session = JSON.parse(localStorage.getItem('session')); }catch{ this.session=null }
},
clear(){ this.session=null; localStorage.removeItem('session'); }
};
UserModel.load();