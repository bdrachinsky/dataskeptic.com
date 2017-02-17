import React from 'react'

import CartQuantity from './CartQuantity'

export const CartItem = ({ title, product, quantity, size = <br/>, subtype, subtotal }) => (
    <div className="cart-row cart-item">
        <div className="remove"><button><i className="glyphicon glyphicon-remove">&nbsp;</i></button></div>
        <div className="product">
            <div className="product-preview">
                <img src={product.img} alt={title} />
            </div>
           <div className="in">
               <div className="product-description">
                   <p className="title">{title}</p>
                   <p className="subtype">{size}</p>
               </div>

               <div className="counter inline">
                   <CartQuantity
                        updateable={true}
                        quantity={quantity}
                        product={product}
                        size={size}
                   />
               </div>
               <div className="price inline">
                   <span>${subtotal}</span>
               </div>
           </div>
        </div>
    </div>
)


export default CartItem