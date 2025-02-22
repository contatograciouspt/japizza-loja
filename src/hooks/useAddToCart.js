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

    // Include zoneSoftId in the cart item
    updatedProduct.zoneSoftId = product.zoneSoftId

    // Add variant names with null check
    const variantNames = product.variant ? Object.entries(product.variant).reduce((acc, [key, value]) => {
      if (key !== 'price' && key !== 'originalPrice' && key !== 'quantity' &&
        key !== 'discount' && key !== 'productId' && key !== 'barcode' &&
        key !== 'sku' && key !== 'image' && variants) {
        const variantInfo = variants.find(v => v._id === value)
        if (variantInfo && variantInfo.name && variantInfo.name.pt) {
          acc.push(variantInfo.name.pt)
        }
      }
      return acc
    }, []) : []

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
