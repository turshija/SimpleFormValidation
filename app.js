/*
Validates form with data-turshija-* attributes
*/
$(function() {
    var validatorPrefix = "turshija";
    
    console.log( "ready!" );
    
    /**
     * Validator functions used for validation
     */
    var supportedValidators = {
        required: function (inputValue, validatorValue) {
            return inputValue.length > 0;
        },
        minlength: function (inputValue, validatorValue) {
            return inputValue.length >= validatorValue;
        },
        maxlength: function (inputValue, validatorValue) {
            return inputValue.length <= validatorValue;
        },
        alpha: function (inputValue, validatorValue) {
            return inputValue.match(/^(\s*|[A-Za-z\s]+)$/);
        },
        alphanumeric: function (inputValue, validatorValue) {
            return inputValue.match(/^(\s*|[A-Za-z0-9\s]+)$/);
        },
        numeric: function (inputValue, validatorValue) {
            return inputValue.match(/^(\s*|[0-9]+)$/);
        },
    }
    
    /**
     * Validator error messages
     */
    var validatorsErrors = {
        required: 'This field is required',
        minlength: 'Text is too short',
        maxlength: 'Text is too long',
        alpha: 'You can use only alphabet letters and spaces',
        alphanumeric: 'You can use only alphabet letters, numbers and spaces',
        numeric: 'You can use only numbers',
    }
    
    /**
     * @source - https://stackoverflow.com/a/14846536
     * took the snipped and modified it to suit me and work dynamically
     */
    var activeValidators = function (dataObj) {
        var prefixLength = validatorPrefix.length;

        var newData = [];
        for (var p in dataObj) {
            if (dataObj.hasOwnProperty(p) && /^turshija[A-Z]+/.test(p)) {
                var shortName = p[prefixLength].toLowerCase() + p.substr(prefixLength + 1);
                newData[shortName] = dataObj[p];
            }
        }
        
        return newData;
    }
    
    /**
     * Toggles error by adding appropriate classes and displays error messages
     */
    var toggleError = function ($input, errors) {
        var $fieldset = $input.closest('fieldset'),
            displayError = errors.length > 0;
            
        $fieldset
            .toggleClass('form-error', displayError)
            .find('.help-block').remove();
            
        if (displayError) {
            _.each(errors, function (error) {
                $fieldset.append(
                    $('<div />', { class: 'help-block', text: error })
                );
            })
        }
    }
    
    $('form.turshijaValidate').on('submit', function (evnt) {
        var $this = $(this),
            formValid = true,
            $inputs = $this.find(':input');
        
        // loop through all inputs in a form
        $inputs.each(function() {
            var $input = $(this),
                inputValue = $input.val(),
                errors = [],
                // get active validators on input (data-turshija-*)
                validate = activeValidators($input.data());
            
            // for each validator - execute function from supportedValidators[key]
            _.forOwn(validate, function(validateValue, validateKey) {
                if (supportedValidators[validateKey]) {
                    var isValid = supportedValidators[validateKey](inputValue, validateValue);
                    
                    if (!isValid) {
                        errors.push(validatorsErrors[validateKey]);
                    }
                }
            });
            
            // toggle errors for specific $input
            toggleError($input, errors);
            
            // for each input do binary AND with form valid (if any input is false formValid will be false)
            formValid &= (errors.length === 0);
        });
        
        if (formValid) {
            console.log('form is valid :)');
            evnt.preventDefault();  // prevent anyway for demo purpose
        } else {
            console.log('form is NOT valid, sorry :(');
            evnt.preventDefault();
        }
        
    }).on('reset', function () {
        // clear all errors on form reset 
        $(this).find(':input').each(function () {
            toggleError($(this), []);
        });
    }).find(':input').on('focus click change blur', function () {
        // clear errors on focus, click, change or blur
        toggleError($(this), []);
    });
});