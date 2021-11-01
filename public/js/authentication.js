import axios from 'axios'
import { cusAlert } from './customAlert'

export const handleLogin = async (e) => {
    try {
        
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        
        const res = await axios({
            method:"POST",
            url:"/api/v1/users/login",
            data:{
                email,password
            }
        })
        
        if(res.status === 200){
            cusAlert(true,"logged out successfully")
            setInterval(() => {
                location.assign('/')
                
            }, 1500);
            
        }
        
    } catch (error) {
        
        cusAlert(false,"there was an error")        
    }
        
}


export const handleLogout = async (e) => {
   
    try {
        
        const res = await axios({
            method:"POST",
            url:"/api/v1/users/logout",
        })
        
        if(res.status === 200){
            location.assign('/')                
            
        }
    } catch (error) {
        
        cusAlert(false,'There was an error')
    }
}


