// Đối tượng Validaton Contructor
function Validator(options) {
    function getParrent(element,selector) {
        // vòng lặp vô hạn
        while(element.parentElement){
            // matches cua parentElement kiem tra
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    // Hàm thực hiện validate
    function validate(inputElement,rule) {
    /*
    - lấy thẻ <Span class="form-message"></span> từ thẻ inputElement bằng cách :
    + inputElement.parentElement // lấy thẻ cha của inputElement
    */
    var errorElement = getParrent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
    // sự kiện blur : khi từ input ấn ra ngoài
        // value : inputElement.value
        // test : rule.test
    var errorMessage = rule.test(inputElement.value);
        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParrent(inputElement,options.formGroupSelector).classList.add('invalid');
        }
        else{
            errorElement.innerText = '';
            getParrent(inputElement,options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    // lấy Element của form
    var formElement = document.querySelector(options.form);
    if(formElement){
        // Khi submit Form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true ;
            // thực hiện lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if(isFormValid){
                if(typeof options.onSubmit == 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                    // conform EnableInputs thành array để thực hiện vòng lặp
                    var formValue = Array.from(enableInputs).reduce(function (value,input) {
                        value[input.name]= input.value
                        return value;
                    },{});
                    options.onSubmit(formValue);
                }
            }
        }
        // lặp qua từng rules và lắng nghe sự kiện
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                // xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                validate(inputElement,rule);
                }
                // xử lý mỗi khi người dùng nhập input
                inputElement.oninput = function () {
                    var errorElement = getParrent(inputElement,options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerText = '';
                    getParrent(inputElement,options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
    }
}

// Định nghĩa Rules
// nguyên tắc chung của Rules
// 1. Khi có lỗi => trả message lỗi
// 2. Khi hợp lệ => Undefined
Validator.isRequired  = function (selector) {
    return {
        selector : selector,
        test : function (value) {
            return value.trim() ? undefined : ' Vui lòng nhập họ và tên này ';
        }
    };
}
Validator.isEmail = function (selector) {
    return {
        selector : selector,
        test : function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : ' Vui lòng nhập email này ';
        }
    };
}
// regex mật khẩu
Validator.isPassword = function (selector) {
    return {
        selector : selector,
        test : function (value) {
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            return passw.test(value) ? undefined : 'Tối thiểu là 6 ký tự gồm Chữ hoa , thường và số ';
        }
    };
}
Validator.isConfimPassword = function (selector,getConfimValue) {
    return {
        selector : selector,
        test : function (value) {
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            return passw.test(value) && value == getConfimValue()  ? undefined : 'Giá trị nhập vào không chính xác';
        }
    };
}
Validator.isLoginPassword = function (selector,getLoginPassword) {
    return {
        selector : selector,
        test : function (value) {
            var pw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            return pw.test(value) && value == getLoginPassword()  ? undefined : 'Giá trị nhập vào không chính xác';
        }
    };
}
