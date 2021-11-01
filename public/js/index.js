import { handleLogin, handleLogout } from "./authentication"
import { handleCheckout } from "./checkout";
import { updatePassword,updateUser } from "./users";


if (document.getElementById('loginform')) {
    document.getElementById('loginform').addEventListener('submit',handleLogin)
}

if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click',handleLogout)
}

if (document.getElementById('edit-password')) {
    document.getElementById('edit-password').addEventListener('click',(e)=>{
        e.preventDefault();
        const oldPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updatePassword({oldPassword,password,passwordConfirm});
    })
}

if (document.getElementById('upuser')) {
    document.getElementById('upuser').addEventListener('click',(e)=>{
        e.preventDefault();
        const form = new FormData();
        
        form.append('email',document.getElementById('email').value)
        form.append('name',document.getElementById('name').value)
        form.append('photo',document.getElementById('photo').files[0])
        updateUser(form);
    })
}


if (document.getElementById('checkout-btn')) {
    document.getElementById('checkout-btn').addEventListener('click',handleCheckout)
}
