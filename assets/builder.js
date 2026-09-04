
const pkg = document.getElementById('package');
const addons = [...document.querySelectorAll('.addon')];
const extra = document.getElementById('extra-pumpkins');
const special = document.getElementById('special-pumpkins');
const totalEl = document.getElementById('total');
const nameEl = document.getElementById('package-name');
const summary = document.getElementById('summary');
const totalInput = document.getElementById('estimated-total-input');
const zip = document.getElementById('zip');
const deliveryNote = document.getElementById('delivery-note');

function calc(){
  let total = Number(pkg.value);
  let items = ['Design, décor, delivery & installation included'];
  addons.forEach(a=>{
    if(a.checked){ total += Number(a.dataset.price); items.push(a.parentElement.innerText.trim()); }
  });
  const e = Number(extra.value||0), s=Number(special.value||0);
  if(e){ total += e*12; items.push(`${e} extra standard pumpkin${e>1?'s':''} — est. $${e*12}`); }
  if(s){ total += s*25; items.push(`${s} extra specialty pumpkin${s>1?'s':''} — est. $${s*25}`); }
  nameEl.textContent = pkg.options[pkg.selectedIndex].text.split('—')[0].trim();
  totalEl.textContent = pkg.options[pkg.selectedIndex].dataset.key === 'signature' ? `From $${total.toLocaleString()}` : `$${total.toLocaleString()}`;
  totalInput.value = totalEl.textContent;
  summary.innerHTML = items.map(i=>`<li>${i}</li>`).join('');
}
function zipCheck(){
  const z=zip.value.trim();
  if(!z){deliveryNote.textContent='Primary service area: 18940, 18938, 18901.';return;}
  if(['18940','18938','18901'].includes(z)){
    deliveryNote.textContent='✓ This ZIP is within the primary service area.';
  }else{
    deliveryNote.textContent='This address may require an additional delivery fee based on distance. By.Soulbloom will confirm it before booking.';
  }
}
[pkg,extra,special,...addons].forEach(el=>el.addEventListener('change',calc));
zip.addEventListener('input',zipCheck);
const params = new URLSearchParams(location.search);
const key=params.get('package');
if(key){
  const opt=[...pkg.options].find(o=>o.dataset.key===key);
  if(opt) pkg.value=opt.value;
}
calc(); zipCheck();
