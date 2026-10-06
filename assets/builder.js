const pkg = document.getElementById('package');
const zip = document.getElementById('zip');
const deliveryNote = document.getElementById('delivery-note');
const photoInputs = [...document.querySelectorAll('.porch-photo-input')];
const photoNote = document.getElementById('photo-upload-note');
const builderForm = document.getElementById('builder');
const preferredDate = document.getElementById('preferred-date');
const MAX_UPLOAD_BYTES = 7 * 1024 * 1024;

function zipCheck(){
  const z = zip.value.trim();
  if(!z){
    deliveryNote.textContent = 'Primary service area: 18940, 18938, 18901, 19046.';
    return;
  }
  if(['18940','18938','18901','19046'].includes(z)){
    deliveryNote.textContent = '✓ This ZIP is within the primary service area.';
  }else{
    deliveryNote.textContent = 'This ZIP may be available with an additional delivery fee. Soul Bloom will confirm before booking.';
  }
}

function photoCheck(){
  const files = photoInputs.map(input => input.files && input.files[0]).filter(Boolean);
  const totalBytes = files.reduce((sum,file) => sum + file.size, 0);
  const totalMb = totalBytes / (1024 * 1024);

  if(!files.length){
    photoNote.textContent = 'Photos are optional. You can always send them after we contact you.';
    photoNote.style.background = '';
    photoNote.style.color = '';
    return true;
  }

  if(totalBytes > MAX_UPLOAD_BYTES){
    photoNote.textContent = `Your selected photos total ${totalMb.toFixed(1)} MB. Please keep all photos together under 7 MB.`;
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

zip.addEventListener('input', zipCheck);
photoInputs.forEach(input => input.addEventListener('change', photoCheck));
builderForm.addEventListener('submit', event => {
  if(!photoCheck()){
    event.preventDefault();
    photoNote.scrollIntoView({behavior:'smooth',block:'center'});
  }
});

setDateMinimum();

const params = new URLSearchParams(location.search);
['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(name => {
  const field = document.getElementById(name);
  if(field) field.value = params.get(name) || '';
});

const referrerField = document.getElementById('landing_referrer');
if(referrerField) referrerField.value = document.referrer || '';

const key = params.get('package');
if(key && pkg){
  const map = {
    'fall-touch':'The Fall Touch — $299',
    'harvest':'The Harvest Porch — $499',
    'grand':'The Grand Harvest — $749',
    'signature':'Soulbloom Signature — from $1,199'
  };
  const value = map[key];
  if(value){
    const opt = [...pkg.options].find(o => o.value === value);
    if(opt) pkg.value = value;
  }
}

zipCheck();
photoCheck();