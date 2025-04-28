const maxLength = 50;

function validateInput(input) {
    input.value = input.value.replace(/[^а-яА-Яa-zA-ZёЁ\s-]/g, '');
    
    if (input.value.startsWith(' ')) {
        input.value = input.value.trim();
        alert('Ошибка: Ввод не должен начинаться с пробела.');
    }

    input.value = input.value.replace(/\s+/g, ' ');

    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        alert('Ошибка: Длина ввода не должна превышать 50 символов.');
    }
}