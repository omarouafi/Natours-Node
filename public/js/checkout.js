import axios from 'axios'
// import stripe from 'stripe'

export const handleCheckout = async (e) => {
    try {
        
    e.preventDefault()
    const st = Stripe('pk_test_51IXaMTEhoV2hRBFs4YrWSrF81hqyOYFCmyVxj6LIrAPPxMNnxuQ0XfoQh9NqiO0qJjYR8ODW8pppREPOVXtlMjyY00lqsXf53k')
    const res = await axios({
        method:'GET',
        url:`/api/v1/booking/checkout/${e.target.dataset.set}`,
    })

    if (res.status == 200) {
        console.log(res.data.session.id);
        st.redirectToCheckout({sessionId:res.data.session.id})
    }

    } catch (error) {
        console.log(error)
    }
    

}