import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';

const SESSION_AGE_MS=12*60*60*1000;
const ATTEMPT_WINDOW_MS=15*60*1000;
function parseUsers(){
  const raw=process.env.APP_USERS_JSON||'';
  if(!raw.trim()){
    if(process.env.NODE_ENV==='production')throw new Error('APP_USERS_JSON es obligatorio en producción. No se inicia el servidor sin cuentas.');
    return null; // desarrollo local exclusivamente
  }
  let users;
  try {users=JSON.parse(raw)}catch{throw Error('APP_USERS_JSON debe ser un objeto JSON válido.')}
  if(!users||typeof users!=='object'||Array.isArray(users))throw Error('APP_USERS_JSON debe ser un objeto.');
  const names=Object.keys(users);
  if(!names.length||names.length>30)throw Error('Se requieren entre 1 y 30 cuentas.');
  const prepared=new Map();
  for(const username of names){
    if(!/^[a-z0-9_.-]{3,30}$/.test(username))throw Error('Usuario inválido en APP_USERS_JSON.');
    const password=users[username];
    if(typeof password!=='string'||password.length<12||password.length>256)throw Error('Cada clave debe tener entre 12 y 256 caracteres.');
    const salt=randomBytes(16);
    prepared.set(username,{salt,hash:scryptSync(password,salt,32)});
  }
  return prepared;
}
function parseCookie(str,name){
  const part=String(str||'').split(';').find(t=>t.trim().startsWith(name+'='));
  return part?part.trim().slice(name.length+1):'';
}
export function createAccessGate(){
  const users=parseUsers();
  const enabled=Boolean(users);
  const sessions=new Map();
  const failures=new Map();
  const budgets=new Map();
  const sessionKey='ec_session';
  const secure=process.env.NODE_ENV==='production';
  const cookieFlags=`Path=/; HttpOnly; SameSite=Strict${secure?'; Secure':''}`;
  const cookieValue=value=>`${sessionKey}=${value}; ${cookieFlags}; Max-Age=${Math.floor(SESSION_AGE_MS/1000)}`;
  const expireCookie=()=>`${sessionKey}=; ${cookieFlags}; Max-Age=0`;
  function principal(req){
    if(!enabled)return {username:'local',token:'local'};
    const token=parseCookie(req.headers.cookie,sessionKey);
    if(!token)return null;
    const data=sessions.get(token);
    if(!data)return null;
    if(data.expires<=Date.now()){sessions.delete(token);return null}
    return {...data,token};
  }
  function tryLogin(username,password,ip){
    const now=Date.now(),rate=failures.get(ip)||{count:0,until:now+ATTEMPT_WINDOW_MS};
    if(now>=rate.until){rate.count=0;rate.until=now+ATTEMPT_WINDOW_MS}
    if(rate.count>=8)return {error:'Demasiados intentos. Espera 15 minutos.',status:429};
    if(typeof username!=='string'||typeof password!=='string'||password.length>256)return {error:'Credenciales inválidas',status:401};
    const stored=users?.get(username);
    // El hash falso dificulta revelar qué nombres de usuario existen por diferencia de tiempos.
    const hashed=scryptSync(password,stored?.salt||Buffer.alloc(16,1),32);
    if(!stored||!timingSafeEqual(hashed,stored.hash)){
      rate.count++;failures.set(ip,rate);
      return {error:'Credenciales incorrectas.',status:401};
    }
    failures.delete(ip);
    const token=randomBytes(32).toString('base64url');
    sessions.set(token,{username,expires:now+SESSION_AGE_MS});
    if(sessions.size>1000)for(const [k,s] of sessions)if(s.expires<=now)sessions.delete(k);
    return {token,username};
  }
  function logout(req){const token=parseCookie(req.headers.cookie,sessionKey);if(token)sessions.delete(token)}
  function consumeAI(identity){
    if(!enabled)return true;
    const key=identity.username,now=Date.now();
    let b=budgets.get(key);
    if(!b||now>=b.until)b={count:0,until:now+60*60*1000};
    if(b.count>=20)return false;
    b.count++;budgets.set(key,b);return true;
  }
  return {enabled,principal,tryLogin,logout,consumeAI,cookieValue,expireCookie};
}
