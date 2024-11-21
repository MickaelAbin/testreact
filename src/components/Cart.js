import '../styles/Cart.css'


function Cart(){
    const monsteraprice = 8
    const lierreprice = 10
    const bouquetprice = 15
return (
    <div className='lmj-cart'> 
        <h2>Panier</h2>
        <ul>
            <li>Monstera : {monsteraprice} euros</li>
            <li>Lierre : {lierreprice} euros</li>
            <li>Bouquet de fleurs : {bouquetprice} euros</li>
        </ul>
      
      Prix total : {monsteraprice+lierreprice+bouquetprice} euros
        
        
    </div>);
    

}
export default Cart