
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
const photoInputs = [...document.querySelectorAll('.porch-photo-input')];
const photoNote = document.getElementById('photo-upload-note');
const builderForm = document.getElementById('builder');
const preferredDate = document.getElementById('preferred-date');
const MAX_UPLOAD_BYTES = 7 * 1024 * 1024;

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
  if(!z){deliveryNote.textContent='Primary service area: 18940, 18938, 18901, 19046.';return;}
  if(['18940','18938','18901','19046'].includes(z)){
    deliveryNote.textContent='✓ This ZIP is within the primary service area.';
  }else{
    deliveryNote.textContent='This address may require an additional delivery fee based on distance. By.Soulbloom will confirm it before booking.';
  }
}
function photoCheck(){
  const files = photoInputs.map(input => input.files && input.files[0]).filter(Boolean);
  const totalBytes = files.reduce((sum,file) => sum + file.size, 0);
  const totalMb = totalBytes / (1024 * 1024);
  if(!files.length){
    photoNote.textContent = 'Photos help us recommend the right package and prepare an accurate design.';
    photoNote.style.background = '';
    photoNote.style.color = '';
    return true;
  }
  if(totalBytes > MAX_UPLOAD_BYTES){
    photoNote.textContent = `Your selected photos total ${totalMb.toFixed(1)} MB. Please keep all photos together under 7 MB so the request can be submitted successfully.`;
    photoNote.style.background = '#fff0eb';
    photoNote.style.color = '#8a2f1e';
    return false;
  }
  photoNote.textContent = `${files.length} photo${files.length === 1 ? '' : 's'} selected · ${totalMb.toFixed(1)} MB total.`;
  photoNote.style.background = '';
  photoNote.style.color = '';
  return true;
}
function setDateMinimum(){
  if(!preferredDate) return;
  const seasonStart = '2026-09-10';
  const seasonEnd = '2026-10-31';
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  if(localToday >= seasonStart && localToday <= seasonEnd){
    preferredDate.min = localToday;
  }
}

[pkg,extra,special,...addons].forEach(el=>el.addEventListener('change',calc));
zip.addEventListener('input',zipCheck);
photoInputs.forEach(input=>input.addEventListener('change',photoCheck));
builderForm.addEventListener('submit', event=>{
  if(!photoCheck()){
    event.preventDefault();
    photoNote.scrollIntoView({behavior:'smooth',block:'center'});
  }
});
setDateMinimum();
const params = new URLSearchParams(location.search);
['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(name=>{
  const field=document.getElementById(name);
  if(field) field.value=params.get(name) || '';
});
const referrerField=document.getElementById('landing_referrer');
if(referrerField) referrerField.value=document.referrer || '';
const key=params.get('package');
if(key){
  const opt=[...pkg.options].find(o=>o.dataset.key===key);
  if(opt) pkg.value=opt.value;
}
calc(); zipCheck(); photoCheck();
