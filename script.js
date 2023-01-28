const rate = 7.53450;

const registerFormat = new RegExp('^0+[0-9]{0,9}[.]?[0-9]{0,2}$');
const registerFullFormat = new RegExp('^0+[0-9]{0,9}[.][0-9]{2}$');

const sibling = { 
  'ceur': 'chrk',
  'chrk': 'ceur',
  'ueur': 'uhrk',
  'uhrk': 'ueur',
};

const nextInput = { 
  'ceur': 'ueur',
  'chrk': 'uhrk',
  'ueur': 'ceur',
  'uhrk': 'chrk',
};

let register;
let activeInput;

function init() {
  initOnInputClickSelectInput();
  initOnButtonClickSelectKey();
  initOnEuroClickAddValue();
  initOnGlobalKeyPressTypeInput();
}

function resetRegister() { register = '0'; }

function initOnInputClickSelectInput() {
  let elements = document.getElementsByTagName('input');
  for (let each of elements) {
    each.addEventListener('click', clickThisInput);
    each.addEventListener('focus', focusThisInput);
  }
}

function initOnButtonClickSelectKey() {
  let elements = document.getElementsByClassName('button');
  for (let each of elements) {
    each.addEventListener('click', selectKey);
  }
}

function initOnEuroClickAddValue() {
  let elements = document.getElementsByTagName('img');
  for (let each of elements) {
    each.addEventListener('click', addValue);
  }
}

function initOnGlobalKeyPressTypeInput() {
  document.addEventListener('keypress',
    e => typeInput(String.fromCharCode(e.which).toUpperCase())
    );
}

function selectInput(inputId) {
  if (activeInput != null) {
    let previous = document.getElementById(activeInput);
    previous.classList.remove('flash');
  }
  activeInput = inputId;
  resetRegister();
  let element = document.getElementById(activeInput);
  element.classList.add('flash');
  element.focus();
}

let lastSelectedInput = null;

window.addEventListener('load', function () { 
  lastSelectedInput = document.activeElement;
  // document.getElementById('ceur').click();
  selectInput('ceur');
});

function focusThisInput(self) {
  if (lastSelectedInput === document.activeElement) return;
  lastSelectedInput = document.activeElement;
  clickThisInput(self);
}

function clickThisInput(self) {
  selectInput(self.target.id);
}

function selectKey(self) {
  let key = self.target.childNodes[0].nodeValue;
  typeInput(key);
}

function addValue(self) {
  selectSiblingIfHrk();
  value = parseFloat(self.target.dataset.value);
  input = document.getElementById(activeInput);
  input.value = (parseFloat(input.value) + value).toFixed(2);
  resetRegister(); // register = input.value;
  input.focus();
  updateSibling();
}

function selectSiblingIfHrk() {
  if (/^[cu]hrk$/.test(activeInput)) { 
    selectInput(sibling[activeInput]);
  }
}

function selectNextInput() {
  selectInput(nextInput[activeInput]);
}

function typeInput(key) {
  input = document.getElementById(activeInput);
  if (key === 'C') { resetRegister(); key = ''; }
  if (key === ',') { key = '.'; }
  if (key === '.' && register.slice(-1) === '.') { key = ''; }

  if (registerFormat.test(register + key)) {
    register += key;
  } else if (registerFormat.test(register.slice(0, -1) + key)) {
    register = register.slice(0, -1) + key;
  }
  input.value = parseFloat(register).toFixed(2);
  input.focus();
  updateSibling();
  if(registerFullFormat.test(register)) selectNextInput();
}

function updateSibling() {
  input = document.getElementById(activeInput);
  v = input.value;
  s = document.getElementById(sibling[activeInput]);
  r = /eur$/.test(activeInput) ? rate : 1/rate;
  s.value = (v * r).toFixed(2);
  updatePovrat();
}

function updatePovrat() {
  updatePEur();
  updatePHrk();
}
function updatePEur() { diff('ueur', 'ceur', 'peur'); }
function updatePHrk() { diff('uhrk', 'chrk', 'phrk'); }
function diff(uid, cid, pid) {
  let num = document.getElementById(uid).value - document.getElementById(cid).value;
  if (num < 0) { num = 0; }
  num = num.toFixed(2);
  document.getElementById(pid).value = num;
}

init();