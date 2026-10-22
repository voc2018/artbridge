/* MyMemory public GET API. No contribution/write API is used. */
(function(root){
 const cache=new Map(),pending=new Map();
 function chunks(text,max=450){const out=[];let part='';for(const ch of text){if(new TextEncoder().encode(part+ch).length>max){out.push(part);part='';}part+=ch;}if(part)out.push(part);return out;}
 function decode(s){const el=document.createElement('textarea');el.innerHTML=s;return el.value;}
 async function translate(text,source,target){
  if(!text.trim()||source===target)return text;
  if(!['en','ko','sw'].includes(source)||!['en','ko','sw'].includes(target))throw Error('Unsupported language');
  const key=JSON.stringify([source,target,text]);if(cache.has(key))return cache.get(key);if(pending.has(key))return pending.get(key);
  const job=(async()=>{const output=[];for(const part of chunks(text)){const url=new URL('https://api.mymemory.translated.net/get');url.searchParams.set('q',part);url.searchParams.set('langpair',source+'|'+target);url.searchParams.set('mt','1');const res=await fetch(url,{signal:AbortSignal.timeout(25000),referrerPolicy:'no-referrer'});if(!res.ok)throw Error('Translation service '+res.status);const data=await res.json();if(Number(data.responseStatus)!==200||data.quotaFinished||typeof data.responseData?.translatedText!=='string')throw Error(data.responseDetails||'Translation unavailable');output.push(decode(data.responseData.translatedText));}const result=output.join(' ');cache.set(key,result);if(cache.size>300)cache.delete(cache.keys().next().value);return result;})();
  pending.set(key,job);try{return await job;}finally{pending.delete(key);}
 }
 root.ArtBridgeTranslation={translate,chunks};
})(window);
