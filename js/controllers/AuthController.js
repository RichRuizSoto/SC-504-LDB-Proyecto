const AuthController = {
async login({usuario_o_email, contrasena}){
const data = await API.post('/auth/login.php',{ usuario_o_email, contrasena, ip:'127.0.0.1', dispositivo:'Web' });
if(data.ok){ UserModel.setSession({ id_usuario:data.id_usuario, id_sesion:data.id_sesion, nombre:data.nombre, rol:data.rol }); }
return data;
},
async register(payload){
const data = await API.post('/auth/register.php', payload);
return data;
},
async logout(){
if(!UserModel.session) return {ok:true};
await API.post('/auth/logout.php',{ id_sesion: UserModel.session.id_sesion });
UserModel.clear();
return {ok:true};
}
};