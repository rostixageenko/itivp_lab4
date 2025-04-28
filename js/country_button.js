const toggleButton = document.getElementById('toggleCountryInput');
const countryInput = document.getElementById('countryInput');

countryInput.style.display = 'none';

toggleButton.addEventListener('click', function() {
    const isVisible = countryInput.style.display === 'block';

    if (isVisible) {
        countryInput.style.display = 'none';
        toggleButton.classList.remove('rotate'); 
    } else {
        countryInput.style.display = 'block';
        toggleButton.classList.add('rotate');
    }
});