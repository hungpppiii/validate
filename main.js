// Viết mã JS tại đây
function Validator(options) {
    let selectorRules = {}
    function validate(inputElement, rule) {
        let errorElement = inputElement.parentElement.querySelector(options.errorForm);
        let errorMessage;
        let rules = selectorRules[rule.selector]
        for (const key in rules) {
            if (Object.hasOwnProperty.call(rules, key)) {
                errorMessage = rules[key](inputElement.value);
                if(errorMessage) break;
            }
        }

        if (errorMessage) {
            inputElement.parentElement.classList.add('invalid');
            errorElement.innerText = errorMessage;
        } else {
            inputElement.parentElement.classList.remove('invalid');
            errorElement.innerText = '';
        }
        return !errorMessage;
    }

    let formElement = document.querySelector(options.form);
    console.log(document.querySelector("#fullname"));

    if(formElement) {
        formElement.onsubmit = (e) => {
            let isFormValid;
            e.preventDefault();
            options.rules.forEach(rule => {
                let inputElement  = document.querySelector(rule.selector);
                isFormValid = validate(inputElement, rule);
            })
            let enableInputs = formElement.querySelectorAll('[name]');
            if (enableInputs === undefined || enableInputs === null)
                return;
            let formValues;
            if (typeof enableInputs[Symbol.iterator] === 'function') {
                formValues = [...enableInputs].reduce((values, input) => {
                    values[input.name] = input.value;
                    return values;
                }, {})
            } else {
                formValues = {
                    [enableInputs.name]: enableInputs.value
                };
            }
            if (isFormValid) {
                if (typeof options.onsubmit === 'function') {
                    options.onsubmit(formValues);
                }
            }
        }
    }

    if (formElement) {
        options.rules.forEach((rule) => {
            if (!selectorRules[rule.selector]) {
                selectorRules[rule.selector] = [];
            }
            selectorRules[rule.selector].push(rule.check);
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                inputElement.oninput = () => {
                    let errorElement = inputElement.parentElement.querySelector(options.errorForm);
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText = '';
                }
            }
        })
    }
}

Validator.isRequired = (selector, message) => ({
    selector: selector,
    check: value => value.trim() ? undefined : message || 'Vui lòng nhập tên hợp lệ!'
})

Validator.isEmail = (selector, message) => ({
    selector: selector,
    check: value => {
        let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;;
        return regex.test(value) ? undefined : message || 'Vui lòng nhập email hợp lệ!';
    }
})

Validator.minLength = (selector, message) => ({
    selector: selector,
    check: value => value.trim().length > 5 ? undefined : message || 'Vui lòng nhập đủ 6 kí tự!'
})

Validator.isConfirm = (selector, CFvalue, message) => ({
    selector: selector,
    check: value => value === CFvalue() ? undefined : message || 'Giá trị nhập vào không đúng!'
})

Validator.isCorrectSyntax = (selector, message) => ({
    selector: selector,
    check: value => !value.includes(' ') ? undefined :message || 'Mật khẩu không chứa dấu cách!'
})

Validator({
    form: '#form-1',
    errorForm: '.form-message',
    rules: [
        Validator.isRequired('#fullname', "Vui lòng nhập trường này"),
        Validator.isRequired('#email', "Vui lòng nhập trường này"),
        Validator.isEmail('#email'),
        Validator.isRequired('#password', "Vui lòng nhập trường này"),
        Validator.isCorrectSyntax('#password', 'Mật khẩu không chứa dấu cách!'),
        Validator.minLength('#password'),
        Validator.isRequired('#password_confirmation', "Vui lòng nhập trường này"),
        Validator.isCorrectSyntax('#password', 'Mật khẩu không chứa dấu cách!'),
        Validator.isConfirm('#password_confirmation', () => document.querySelector('#form-1 #password').value),
    ],
    onsubmit: (data) => {
        console.log(data);
    }
})