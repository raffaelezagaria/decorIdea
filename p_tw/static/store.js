fetch("/static/items.json")
.then(function(response){
	return response.json();
})

.then(function(data){
	localStorage.setItem("items", JSON.stringify(data));
	if(!localStorage.getItem("cart")){
		localStorage.setItem("cart", "[]");
	}
});




/*
//dichiaro variabili per spostare gli itemStorage, nell'array cart creato
let products = JSON.parse(localStorage.getItem("items"));
let cart = JSON.parse(localStorage.getItem("cart"));


//scrivo la funziona che sposterà gli articoli del carrello nell'array

function addItemToCart(productId){
	let product = products.find(function(product)){
		return product.id == productId;
	});
	
	if(cart.length == 0){
		cart.push(product);                   
	}else{
		let res = cart.find(element => element.id == productId);
	}
	localStorage.setItem("cart", JSON.stringify(cart));
}

//funzione che sposta gli rimossi in una vriabile

function removeItemFromCart(productId){
	let temp = cart.filter(item => item.id != productId);
	localStorage.setItem("cart", JSON.stringify(temp));
	
}
*/

if (document.readyState == 'loading'){
	document.addEventListener('DOMContentLoaded', ready)
}else{
	ready()
}

function ready(){
	
	var removeCartItemButtons = document.getElementsByClassName('btn-danger')
	console.log(removeCartItemButtons)
	
	for (var i = 0; i < removeCartItemButtons.length; i++){
		
		var button = removeCartItemButtons[i]
		button.addEventListener('click', removeCartItem)
			
		}
		
		var quantityInputs = document.getElementsByClassName('cart-quantity-input')
		for(var i= 0; i< quantityInputs.length; i++){
			var input = quantityInputs[i]
			input.addEventListener('change',  quantityChanged)
		}
	var addToCartButtons = document.getElementsByClassName('shop-item-button')
	for (var i = 0; i < addToCartButtons.length; i++){
		var button = addToCartButtons[i]
		button.addEventListener('click', addToCartClicked)
	}
	
	document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
	
	}
	
	
	
	
	
	
	
	function purchaseClicked(){
		alert('Thank you for your order, you will soon receive an e-mail with your tracciability code!')
		alert('Remember to have your credit card handy when the courier arrives!')
		var cartItems = document.getElementsByClassName('cart-items')[0]
		while(cartItems.hasChildNodes()){
			cartItems.removeChild(cartItems.firstChild)
		}
		updateCartTotal()
	}









function removeCartItem(event){
	var buttonClicked = event.target
	buttonClicked.parentElement.parentElement.remove()
	updateCartTotal()
}









function quantityChanged(event){
	var input = event.target
	if(isNaN(input.value) || input.value <= 0){
	 input.value = 1
	}
	updateCartTotal()
}







function addToCartClicked(event){
	var button = event.target
	var shopItem = button.parentElement.parentElement
	var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
	var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
	var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
	addItemToCart(title, price, imageSrc)
	updateCartTotal()
}






function addItemToCart(title, price, imageSrc){
	var cartRow = document.createElement('div')
	cartRow.classList.add('cart-row')
	var cartItems = document.getElementsByClassName('cart-items')[0]
	var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
	for(var i= 0; i< cartItemNames.lenght; i++){
		if(cartItemNames[i].innerText == title){
			
			alert('This item is already added to the cart')
			
			return 
		}
	}
	var cartRowContents = `
<div class="cart-item cart-column">
						<img class="cart-item-image" src="${imageSrc}" width="100" height="100">
						<span class="cart-item-title">${title}</span>
					</div>
					<span class="cart-price cart-column">${price}</span>
					<div class="cart-quantity cart-column">
						<input class="cart-quantity-input" type="number" value="1">
						<button class="btn btn-danger" type="button">REMOVE</button>
					</div>
`
	cartRow.innerHTML = cartRowContents
	cartItems.append(cartRow)
	cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
	cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}












function updateCartTotal(){
	var cartItemContainer = document.getElementsByClassName('cart-items')[0]
	var cartRows = cartItemContainer.getElementsByClassName('cart-row')
	var total= 0
	for (var i = 0; i < cartRows.length; i++){
		var cartRow = cartRows[i]
		var priceElement = cartRow.getElementsByClassName('cart-price')[0]
		var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')
		[0]
		var price = parseFloat(priceElement.innerText.replace('$', ''))
		var quantity = quantityElement.value
		total = total + (price * quantity)
		
	}
	total = Math.round(total * 100) / 100
	document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}