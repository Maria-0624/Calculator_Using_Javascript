const keys= document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input="";

for(let key of keys){
    const value = key.dataset.key;
    key.addEventListener('click', () => {
        if(value === 'clear'){
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
            }else if(value=="backspace"){
                input = input.slice(0, -1);
                display_input.innerHTML = CleanInput(input);
            }else if(value == "="){
                let result = eval(PrepareInput(input));
                display_output.innerHTML = CleanOuput(result);
            }else if(value == "brackets"){
                if(input.indexOf("(") == -1 || 
                   input.indexOf("(") != -1 && 
                   input.indexOf(")") != -1 && 
                   input.lastIndexOf("(") < input.lastIndexOf(")")
                  )
                /*
                 input.indexOf("(") == -1 It means there is no opening bracket
                 input.indexOf("(") != -1 It means there is an opening bracket
                 input.indexOf(")") != -1 It means there is a closing bracket
                 input.lastIndexOf("(") < input.lastIndexOf(")") It means there are more closing brackets than opening brackets
                so we add an opening bracket
                */
                {
                    input += "(";
                }else if(input.indexOf("(") != -1 && 
                         input.indexOf(")") == -1 ||
                         input.indexOf("(") != -1 &&
                         input.indexOf(")") != -1 &&
                         input.lastIndexOf("(") > input.lastIndexOf(")")
                        )
                    /*
                    input.indexOf("(") != -1 && It means there is an opening bracket
                    input.indexOf(")") == -1 || It means there is no closing bracket
                    input.indexOf("(") != -1 && It means there is an opening bracket
                    input.indexOf(")") != -1 && It means there is a closing bracket
                    input.lastIndexOf("(") > input.lastIndexOf(")") It means there are more opening brackets than closing brackets
                    so we will add an closing bracket
                    */
                {
                    input += ")";
                }

                display_input.innerHTML=CleanInput(input);
            }else{
                if(ValidateInput(value)){
                    input += value;
                    display_input.innerHTML=CleanInput(input);
                }   
            }
})
}

function CleanInput(input){
    let input_array=input.split("");
    let input_array_length=input_array.length;

    for(let i=0; i<input_array_length;i++)
    {
        if (input_array[i] == "*")
        {
            input_array[i] = ' <span class="operator">x</span> ';
        }else if(input_array[i] == "/")
        {
            input_array[i] = ' <span class="operator">÷</span> ';
        }else if(input_array[i] == "+")
        {
            input_array[i] = ' <span class="operator">+</span> ';
        }else if(input_array[i] == "-")
        {
            input_array[i] = ' <span class="operator">-</span> ';
        }else if(input_array[i] == "(")
        {
            input_array[i] = '<span class="brackets">(</span>';
        }else if(input_array[i] == ")")
        {
            input_array[i] = '<span class="brackets">)</span>';
        }else if(input_array[i] == "%")
        {
            input_array[i] = '<span class="percent">%</span>';
        }
    }
    return input_array.join("");
}

function CleanOuput(output){
    let output_string=output.toString();
    let decimal=output_string.split(".")[1];
    output_string=output_string.split(".")[0];

    let output_array = output_string.split("");

    if(output_array.length > 3)
    {
        for(let i = output_array.length - 3; i > 0; i-=3)
        {
            output_array.splice(i, 0, ",");
        }
    }

    if(decimal)
    {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");

}

function ValidateInput(value){
    let last_input = input.slice(-1);
    let operators = ["+","-","*","/"];
    
    if(value == "." && last_input == ".")
    {
        return false;
    }

    if(operators.includes(value))
    {
        if(operators.includes(last_input))
        {
            return false;
        }else{
            return true;
        }
    }
    return true;
}

function PrepareInput(input) {
    return input.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
        // If there is an operator before the percentage, apply it to the previous number
        const operatorBefore = input[input.indexOf(match) - 1];
        if (operatorBefore && /[\+\-\*\/]/.test(operatorBefore)) {
            const precedingNumber = input.split(/[\+\-\*\/]/).slice(-2, -1)[0];
            return `(${precedingNumber} * ${number}/100)`;
        } else {
            // Otherwise, apply the percentage to the number itself
            return `(${number}/100)`;
        }
    });
}

