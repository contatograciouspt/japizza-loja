import { useState } from "react"
import { useCart } from "react-use-cart"

import { notifyError, notifySuccess } from "@utils/toast"

const useAddToCart = () => {
  const [item, setItem] = useState(1)
  const { addItem, items, updateItemQuantity } = useCart()

  const handleAddItem = (product) => {
    const result = items.find((i) => i.id === product.id)
    const { variants, categories, description, ...updatedProduct } = product

    updatedProduct.zoneSoftId = product.zoneSoftId
    updatedProduct.variant = {
      ...product.variant,
      extras: product.extras || []
    }
    updatedProduct.extras = product.extras || []

    if (result !== undefined) {
      if (result?.quantity + item <= (product?.variants?.length > 0 ? product?.variant?.quantity : product?.stock)) {
        addItem(updatedProduct, item)
        notifySuccess(`${item} ${product.title} adicionado no carrinho!`)
      } else {
        notifyError("Estoque insuficiente!")
      }
    } else {
      if (item <= (product?.variants?.length > 0 ? product?.variant?.quantity : product?.stock)) {
        addItem(updatedProduct, item)
        notifySuccess(`${item} ${product.title} adicionado no carrinho!`)
      } else {
        notifyError("Estoque insuficiente!")
      }
    }
  }

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id)
    if (result) {
      if (
        result?.quantity + item <=
        (product?.variants?.length > 0
          ? product?.variant?.quantity
          : product?.stock)
      ) {
        updateItemQuantity(product.id, product.quantity + 1)
      } else {
        notifyError("Estoque insuficiente!")
      }
    }
  }

  return {
    setItem,
    item,
    handleAddItem,
    handleIncreaseQuantity,
  }
}

export default useAddToCart
