import useTranslation from "next-translate/useTranslation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { FiMinus, FiPlus } from "react-icons/fi"

import Price from "@components/common/Price"
import Stock from "@components/common/Stock"
import Tags from "@components/common/Tags"
import { notifyError } from "@utils/toast"
import useAddToCart from "@hooks/useAddToCart"
import MainModal from "@components/modal/MainModal"
import Discount from "@components/common/Discount"
import VariantList from "@components/variants/VariantList"
import { SidebarContext } from "@context/SidebarContext"
import useUtilsFunction from "@hooks/useUtilsFunction"

const ProductModal = ({ modalOpen, setModalOpen, product, attributes, currency }) => {
  const { setIsLoading, isLoading } = useContext(SidebarContext)
  const { t } = useTranslation("ns1")
  const { handleAddItem, setItem, item } = useAddToCart()
  const { showingTranslateValue, getNumber } = useUtilsFunction()

  // Estados
  const [value, setValue] = useState("")
  const [price, setPrice] = useState(0)
  const [basePrice, setBasePrice] = useState(0)
  const [extraPrices, setExtraPrices] = useState(0)
  const [img, setImg] = useState("")
  const [originalPrice, setOriginalPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [discount, setDiscount] = useState(0)

  // Aqui ficam as informações das variantes selecionadas
  const [selectVariant, setSelectVariant] = useState({})
  const [selectVa, setSelectVa] = useState({})
  const [variantTitle, setVariantTitle] = useState([])
  const [variants, setVariants] = useState([])
  const [selectedProductExtras, setSelectedProductExtras] = useState([])

  const onChangeMultiSelect = (updatedCheckboxes, attributeId) => {
    let totalExtraPrice = 0
    const selectedExtras = []

    const extrasAttribute = attributes.find(attr => attr._id === attributeId && attr.option === "Checkbox")

    if (extrasAttribute) {
      updatedCheckboxes.forEach(extraId => {
        const selectedExtra = extrasAttribute.variants.find(v => v._id === extraId)
        console.log("Nome do Extra selecionado: ", selectedExtra)
        if (selectedExtra?.name?.pt) {
          selectedExtras.push(selectedExtra.name.pt)
          const variantWithPrice = product?.variants?.find(v => v[attributeId] === extraId)
          if (variantWithPrice?.price) {
            totalExtraPrice += getNumber(variantWithPrice.price)
          }
        }
      })

      setSelectedProductExtras(selectedExtras)
      setSelectVariant(prev => ({
        ...prev,
        selectedExtras: selectedExtras
      }))
    }

    setExtraPrices(totalExtraPrice)
  }

  // useEffect para atualizar preço base e imagem, conforme o Tamanho selecionado (Radio)
  useEffect(() => {
    let currentBasePrice = 0
    let selectedVariantResult
    let selectedVariantNames = []

    // Verifica se já selecionou algo
    if (Object.keys(selectVa).length > 0) {
      // Filtra product.variants para achar a variante que bate com o que está em selectVa
      selectedVariantResult = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      )

      // Collect variant names
      variantTitle?.forEach(attribute => {
        const selectedValue = selectVa[attribute._id]
        const selectedVariant = attribute.variants?.find(v => v._id === selectedValue)
        if (selectedVariant) {
          selectedVariantNames.push(showingTranslateValue(selectedVariant.name))
        }
      })
    }

    if (selectedVariantResult && selectedVariantResult.length > 0) {
      const resultVariant = selectedVariantResult[0]
      setVariants(selectedVariantResult)
      // setSelectVariant(resultVariant)
      setSelectVariant({
        ...resultVariant,
        variantNames: selectedVariantNames.join(', ')
      })
      setSelectVa(resultVariant)
      setImg(resultVariant?.image)
      setStock(resultVariant?.quantity)
      currentBasePrice = getNumber(resultVariant?.price)

      const originalPriceForVariant = getNumber(resultVariant?.originalPrice)
      const discountPercentage = getNumber(((originalPriceForVariant - currentBasePrice) / originalPriceForVariant) * 100)
      setDiscount(discountPercentage)
      setBasePrice(currentBasePrice)
      setOriginalPrice(originalPriceForVariant)
    }
    else if (product?.variants?.length > 0) {
      // Caso não tenha selecionado nada ainda, pega a primeira variante
      const firstVariant = product.variants[0]
      setVariants([firstVariant])
      setStock(firstVariant?.quantity)
      setSelectVariant(firstVariant)
      setSelectVa(firstVariant)
      setImg(firstVariant?.image)
      currentBasePrice = getNumber(firstVariant?.price)

      const originalPriceForVariant = getNumber(firstVariant?.originalPrice)
      const discountPercentage = getNumber(((originalPriceForVariant - currentBasePrice) / originalPriceForVariant) * 100)
      setDiscount(discountPercentage)
      setBasePrice(currentBasePrice)
      setOriginalPrice(originalPriceForVariant)
    }
    else {
      // Se não tiver variants, pega do produto
      setStock(product?.stock)
      setImg(product?.image[0])
      currentBasePrice = getNumber(product?.prices?.price)

      const originalPriceProduct = getNumber(product?.prices?.originalPrice)
      const discountPercentage = getNumber(((originalPriceProduct - currentBasePrice) / originalPriceProduct) * 100)
      setDiscount(discountPercentage)
      setBasePrice(currentBasePrice)
      setOriginalPrice(originalPriceProduct)
    }

    // Preço final = base + extras
    setPrice(basePrice + extraPrices)
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product?.variants,
    selectVa,
    extraPrices,
    basePrice
  ])

  // Descobre quais atributos existem (para renderizar no map)
  useEffect(() => {
    const res = Object.keys(Object.assign({}, ...product?.variants))
    const varTitle = attributes?.filter((att) => res.includes(att?._id))
    setVariantTitle(varTitle?.sort())
  }, [variants, attributes, product?.variants])

  // Botão Adicionar ao carrinho
  const handleAddToCart = (p) => {
    if (p.variants.length === 1 && p.variants[0].quantity < 1) {
      return notifyError("Estoque insuficiente")
    }
    if (stock <= 0) return notifyError("Estoque insuficiente")

    // Verifica se a variante atual corresponde à seleção
    if (product?.variants.map((variant) => Object.entries(variant).sort().toString() === Object.entries(selectVariant).sort().toString())) {
      const newItem = {
        ...p,
        id: `${p?.variants.length <= 0 ? p._id : p._id + "-" + variantTitle?.map((att) => selectVariant[att._id]).join("-")}`,
        title: `${p?.variants.length <= 0 ? showingTranslateValue(p.title) : showingTranslateValue(p.title) + "-" + variantTitle?.map((att) => att.variants?.find((v) => v._id === selectVariant[att._id])).map((el) => showingTranslateValue(el?.name))}`,
        image: img,
        variant: {
          ...selectVariant,
          variantNames: variantTitle?.map((att) => att.variants?.find((v) => v._id === selectVariant[att._id])).map((el) => showingTranslateValue(el?.name)).join(", ")
        },
        extras: selectedProductExtras,
        price: price,
        originalPrice: originalPrice
      }
      handleAddItem(newItem)
    } else {
      return notifyError("Please select all variant first!")
    }
  }

  const category_name = showingTranslateValue(product?.category?.name)
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-")

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block overflow-y-auto h-full align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
          {/* <Link href={`/product/${product.slug}`} passHref> */}
          <div
            onClick={() => setModalOpen(false)}
            className="flex-shrink-0 flex items-center justify-center h-auto cursor-pointer"
          >
            <Discount product={product} discount={discount} modal />
            {product.image[0] ? (
              <Image
                src={img || product.image[0]}
                width={420}
                height={420}
                alt="product"
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                width={420}
                height={420}
                alt="product Image"
              />
            )}
          </div>
          {/* </Link> */}
          <div className="w-full flex flex-col p-5 md:p-8 text-left">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              {/* <Link href={`/product/${product.slug}`} passHref> */}
              <h1
                onClick={() => setModalOpen(false)}
                className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif hover:text-black cursor-pointer"
              >
                {showingTranslateValue(product?.title)}
              </h1>
              {/* </Link> */}
            </div>
            <p className="text-sm leading-6 text-gray-500 md:leading-6">
              {showingTranslateValue(product?.description)}
            </p>
            <div className="flex items-center my-4">
              <Price
                product={product}
                price={price}
                currency={currency}
                originalPrice={originalPrice}
              />
            </div>
            <div className="mb-1">
              {variantTitle?.map((a) => (
                <span key={a._id}>
                  <h4 className="text-sm py-1 font-serif text-gray-700 font-bold">
                    {showingTranslateValue(a?.name)}:
                  </h4>
                  <div className="flex flex-row mb-3">
                    <VariantList
                      att={a._id}
                      option={a.option}
                      variants={product?.variants}
                      varTitle={variantTitle}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                      setSelectVa={setSelectVa}
                      setValue={setValue}
                      onChangeMultiSelect={a.option === "Checkbox" ? onChangeMultiSelect : undefined}
                    />
                  </div>
                </span>
              ))}
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 md:h-12 border-gray-300">
                  <button
                    onClick={() => setItem(item - 1)}
                    disabled={item === 1}
                    className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-e border-gray-300 hover:text-gray-500"
                  >
                    <span className="text-dark text-base">
                      <FiMinus />
                    </span>
                  </button>
                  <p className="font-semibold flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-8 md:w-20 xl:w-24">
                    {item}
                  </p>
                  <button
                    onClick={() => setItem(item + 1)}
                    disabled={product.quantity < item || product.quantity === item}
                    className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-s border-gray-300 hover:text-gray-500"
                  >
                    <span className="text-dark text-base">
                      <FiPlus />
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity < 1}
                  className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 ml-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white bg-emerald-500 hover:bg-emerald-600 w-full h-12"
                >
                  {t("common:addToCart")}
                </button>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                <div>
                  <span className="font-serif font-semibold py-1 text-sm d-block">
                    <span className="text-gray-700">{t("common:category")}:</span>
                    <button
                      type="button"
                      className="text-gray-600 font-serif font-medium underline ml-2 hover:text-teal-600"
                      onClick={() => setIsLoading(!isLoading)}
                    >
                      {category_name}
                    </button>
                  </span>
                  <Tags product={product} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <p className="text-xs sm:text-sm text-gray-600">
                Precisa de ajuda? ligue neste número :
                <span className="text-red-500 font-semibold">+351 912 827 537</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainModal>
  )
}

export default ProductModal