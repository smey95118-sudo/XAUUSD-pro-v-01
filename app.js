const $=id=>document.getElementById(id);
let apiKey=localStorage.getItem('td_api_key')||'';
let symbol=localStorage.getItem('td_symbol')||'XAU/USD';
let interval=localStorage.getItem('td_interval')||'15min';
let timer=null, chart=null, candleSeries=null;

function initChart(){
  const el=$('chart');
  chart=LightweightCharts.createChart(el,{layout:{background:{type:'solid',color:'#090a0b'},textColor:'#9da4ad'},grid:{vertLines:{color:'#171a1d'},horzLines:{color:'#171a1d'}},rightPriceScale:{borderColor:'#292d32'},timeScale:{borderColor:'#292d32',timeVisible:true,secondsVisible:false},crosshair:{mode:1}});
  candleSeries=chart.addCandlestickSeries({upColor:'#18d58b',downColor:'#ff5265',borderUpColor:'#18d58b',borderDownColor:'#ff5265',wickUpColor:'#18d58b',wickDownColor:'#ff5265'});
  new ResizeObserver(()=>chart.applyOptions({width:el.clientWidth})).observe(el);
}
function fmt(v){return Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function setStatus(s){$('chartStatus').textContent=s}
function setActive(){document.querySelectorAll('#timeframes button').forEach(b=>b.classList.toggle('active',b.dataset.interval===interval))}
async function load(){
  if(!apiKey){setStatus('Enter your Twelve Data API key in ⚙ Settings.');return}
  setStatus('Loading '+symbol+' '+interval+'…');
  try{
    const u=new URL('https://api.twelvedata.com/time_series');
    u.searchParams.set('symbol',symbol);u.searchParams.set('interval',interval);u.searchParams.set('outputsize','300');u.searchParams.set('order','asc');u.searchParams.set('timezone','Asia/Phnom_Penh');u.searchParams.set('apikey',apiKey);
    const r=await fetch(u); const data=await r.json();
    if(data.status==='error'||!data.values) throw new Error(data.message||'No market data returned');
    const vals=data.values.map(x=>({time:Math.floor(new Date(x.datetime.replace(' ','T')).getTime()/1000),open:+x.open,high:+x.high,low:+x.low,close:+x.close})).filter(x=>Number.isFinite(x.time));
    candleSeries.setData(vals);
    chart.timeScale().fitContent();
    const last=vals[vals.length-1], prev=vals[vals.length-2];
    $('price').textContent=fmt(last.close);
    const ch=prev?last.close-prev.close:0, pct=prev?(ch/prev.close*100):0;
    $('change').textContent=(ch>=0?'+':'')+fmt(ch)+' ('+(pct>=0?'+':'')+pct.toFixed(2)+'%)';
    $('change').style.color=ch>=0?'#18d58b':'#ff5265';
    $('open').textContent=fmt(last.open);$('high').textContent=fmt(last.high);$('low').textContent=fmt(last.low);$('close').textContent=fmt(last.close);
    $('updated').textContent=new Date(last.time*1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setStatus('Live data loaded • '+vals.length+' candles');
  }catch(e){setStatus('Error: '+e.message);}
}
function save(){apiKey=$('apiKey').value.trim();symbol=$('symbol').value.trim()||'XAU/USD';localStorage.setItem('td_api_key',apiKey);localStorage.setItem('td_symbol',symbol);$('modal').classList.add('hidden');load()}
$('settingsBtn').onclick=()=>{$('apiKey').value=apiKey;$('symbol').value=symbol;$('modal').classList.remove('hidden')};$('closeModal').onclick=()=>$('modal').classList.add('hidden');$('saveSettings').onclick=save;$('clearKey').onclick=()=>{$('apiKey').value='';apiKey='';localStorage.removeItem('td_api_key');setStatus('API key cleared. Enter a new key in Settings.')};
document.querySelectorAll('#timeframes button').forEach(b=>b.onclick=()=>{interval=b.dataset.interval;localStorage.setItem('td_interval',interval);setActive();load()});$('refreshBtn').onclick=load;
initChart();setActive();if(apiKey)load();timer=setInterval(()=>{if(apiKey)load()},30000);
