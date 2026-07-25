const RPC='https://mainnet.base.org';
const CREDITS='0x13866F31c60822Ff70684213b9727915Ddf2c183';
const TOKEN='0xEA1221B4d80A89BD8C75248Fae7c176BD1854698';
async function call(to,data){
  const r=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_call',params:[{to,data},'latest']})});
  const j=await r.json(); if(j.error) throw new Error(j.error.message); return j.result;
}
async function code(a){
  const r=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getCode',params:[a,'latest']})});
  return (await r.json()).result;
}
const c1=await code(CREDITS), c2=await code(TOKEN);
console.log('credits contract deployed:', c1 && c1!=='0x', 'bytecode len', c1?.length);
console.log('token contract deployed:', c2 && c2!=='0x', 'bytecode len', c2?.length);
// creditsPerAGL() = 0x... compute selectors
import {createHash} from 'crypto';
const sel = {
  'creditsPerAGL()':'0x'+'',
};
// use known keccak via ethers-less approach: hardcode by querying 4byte is overkill. Use simple keccak impl:
