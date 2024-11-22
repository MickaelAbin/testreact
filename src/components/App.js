import React from 'react'
import Banner from './Banner'
import logo from '../assets/logo.png'
import Cart from './Cart'
import Footer from './Footer'
import ShoppingList from './ShoppingList'
import '../styles/Layout.css'
import { useState } from 'react'

function App() {
	const [cart, updateCart] = useState([])
	
	// const loadData = async () => {
	// 	const data = await fetch('http://localhost:3000/apps/list')
	// 	console.log(data)
	// }

	// React.useEffect(() => {
	// 	loadData()
	// }, [])

	return (
		<div>
			<Banner>
				<img src={logo} alt='La maison jungle' className='lmj-logo' />
				<h1 className='lmj-title'>La maison jungle</h1>
			</Banner>
			<div className='lmj-layout-inner'>
				<Cart cart={cart} updateCart={updateCart} />
				<ShoppingList cart={cart} updateCart={updateCart}/>
			</div>
			<Footer />
		</div>
	)
}

export default App