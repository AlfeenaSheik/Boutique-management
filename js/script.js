const form = document.getElementById('Form');
const fullname = document.getElementById('Fullname');
const email = document.getElementById('email');
const username = document.getElementById('username');
const password = document.getElementsByName('password');
const password2 = document.getElementById('confirm_password');
const phonenumber=document.getElementById('Phone_number');

form.addEventListener('submit',e=>{
    e.preventDefault();

    validateInputs();

});
const setError=(element,message)=> {
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

    errorDisplay.innerText=message;
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail=email =>{
    const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).tolowerCase());
};
const setSuccess =element=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

};
const validateInputs=()=>{
    const usernameValue=username.value.trim();
    const fullnameValue=fullname.value.trim();
    const emailValue=email.value.trim();
    const passwordValue=password.value.trim();
    const password2Value=password2.value.trim();
    const phonenumberValue=phonenumber.value.trim() ;
    if(fullname===''){
        setError(fullname,'Fullname is required');
    }else{
        setSuccess(fullname);
    }

    if(username===''){
        setError(username,'Username is required');
    }else{
        setSuccess(username);
    }
    
    if(emailValue==='') {
        setError(email,'Email is required');
    }else if(!isValidEmail(emailvalue)) {
        setError(email,'Provide a valid email address');
    }else {
        setSuccess(email);
    }
       
    if(passwordValue==='') {
        setError(password,'Password is required');
    }else if(passwordVValue.length<8){
        setError(password,'Password must be atleast 8 characters');
    }else{
        setSuccess(password);
    }


    if(password2Value===''){
        setError(password2,'Password confirm your password');
    }else if(password2Value!==passwordValue){
        setError(password2,'Password doesnot match');
    }else{
        setSuccess(password2);
    }
    if(phonenumberValue.length==0)
    {
        setError(phonenumber,'INVALID NUMBER');
    }
    else
    {
        var flag=1;
        for(i=0;i<phonenumberValue.length;i++)
        {
            if(phonenumberValue[i]>=48 && phonenumberValue<=57)
            {
            }
            else{
                flag=0;
            }
        }
        if(flag==0)
        {
            setError(phonenumber,"INVALID PHONE NUMBER"); 
        }
        else{
            setSuccess(phonenumber); 
        }
    }

};


