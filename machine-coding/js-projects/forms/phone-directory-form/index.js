const nameInput = document.getElementById('name');
const mobileInput = document.getElementById('mobile');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit');
const errorBox = document.getElementById('error');
const summaryTable = document.getElementById('summaryTable').querySelector('tbody');
const searchInput = document.getElementById('search')
function isValidName(name) {
    return /^[A-Za-z ]{1,20}$/.test(name);
}

function isValidMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

function isValidEmail(email) {
    const emailRegex = /^[A-Za-z][A-Za-z0-9.]{1,9}@/;
    return emailRegex.test(email);
}

function resetForm() {
    nameInput.value = '';
    mobileInput.value = '';
    emailInput.value = '';
}

searchInput.addEventListener('change',function(e){
    console.log(e.target.value, summaryTable)
})

function showError(show) {
    errorBox.style.display = show ? 'block' : 'none';
}

submitBtn.addEventListener('click', function () {
    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim();
    const email = emailInput.value.trim();

    if (!isValidName(name) || !isValidMobile(mobile) || !isValidEmail(email)) {
        showError(true);
        return;
    }

    showError(false);
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${name}</td><td>${mobile}</td><td>${email}</td>`;
    summaryTable.appendChild(newRow);
    resetForm();
});
