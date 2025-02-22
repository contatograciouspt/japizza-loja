import { useState } from "react"
import { useCart } from "react-use-cart"

import { notifyError, notifySuccess } from "@utils/toast"

const useAddToCart = () => {
  const [item, setItem] = useState(1)
  const { addItem, items, updateItemQuantity } = useCart()

  // const handleAddItem = (product) => {
  //   const result = items.find((i) => i.id === product.id)
  //   const { variants, categories, description, ...updatedProduct } = product

  //   if (result !== undefined) {
  //     if (
  //       result?.quantity + item <=
  //       (product?.variants?.length > 0
  //         ? product?.variant?.quantity
  //         : product?.stock)
  //     ) {
  //       addItem(updatedProduct, item)
  //       notifySuccess(`${item} ${product.title} adicionado no carrinho!`)
  //     } else {
  //       notifyError("Insufficient stock!")
  //     }
  //   } else {
  //     if (
  //       item <=
  //       (product?.variants?.length > 0
  //         ? product?.variant?.quantity
  //         : product?.stock)
  //     ) {
  //       addItem(updatedProduct, item)
  //       console.log("Produto adicionado no carrinho: ", product)
  //       notifySuccess(`${item} ${product.title} adicionado no carrinho!`)
  //     } else {
  //       notifyError("Insufficient stock!")
  //     }
  //   }
  // }

  const handleAddItem = (product) => {
    const result = items.find((i) => i.id === product.id)
    const { variants, categories, description, ...updatedProduct } = product
    
    // incluir zoneSoftId no carrinho
    updatedProduct.zoneSoftId = product.zoneSoftId

    // Add variant names to the product
    const variantNames = Object.entries(product.variant).reduce((acc, [key, value]) => {
      if (key !== 'price' && key !== 'originalPrice' && key !== 'quantity' && key !== 'discount' && key !== 'productId' && key !== 'barcode' && key !== 'sku' && key !== 'image') {
        const variantInfo = variants.find(v => v._id === value)
        if (variantInfo) {
          acc.push(variantInfo.name.pt)
        }
      }
      return acc
    }, [])

    updatedProduct.variantNames = variantNames

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
        console.log("Produto adicionado no carrinho: ", product)
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
        notifyError("Insufficient stock!")
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
