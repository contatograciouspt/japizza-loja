// Checkout.js
import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { FaHome } from "react-icons/fa"
import useTranslation from "next-translate/useTranslation"
import { IoReturnUpBackOutline, IoArrowForward, IoBagHandle, IoMapSharp, IoCalendarOutline } from "react-icons/io5"

//internal import
import Layout from "@layout/Layout"
import Label from "@components/form/Label"
import Error from "@components/form/Error"
import CartItem from "@components/cart/CartItem"
import InputArea from "@components/form/InputArea"
import useGetSetting from "@hooks/useGetSetting"
import InputShipping from "@components/form/InputShipping"
import useCheckoutSubmit from "@hooks/useCheckoutSubmit"
import useUtilsFunction from "@hooks/useUtilsFunction"
import SettingServices from "@services/SettingServices"
import SwitchToggle from "@components/form/SwitchToggle"
import InputDelivery from "@components/form/InputDelivery"
import MapCheckoutModal from "@components/modal/MapCheckoutModal"
import PaymentMethodModal from "@components/modal/PaymentMethodModal"
import AgendamentoModal from "@components/modal/AgendamentoModal"

const Checkout = () => {
  const { t } = useTranslation()
  const { storeCustomizationSetting } = useGetSetting()
  const { showingTranslateValue } = useUtilsFunction()
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [address, setAddress] = React.useState({
    street: "", city: "", country: "", zipCode: "", additionalInformation: "", nif: "", email: "",
  })
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false)
  const [selectedMapShippingCost, setSelectedMapShippingCost] = React.useState(0)
  const [freteCoordenadas, setFreteCoordenadas] = React.useState("")
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = React.useState(false)
  const [isOrderButtonEnabled, setIsOrderButtonEnabled] = React.useState(false)


  React.useEffect(() => {
    const verificarHorarioFuncionamento = () => {
      const now = new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" })
      const portugalTime = new Date(now)
      const diaSemanaAtual = portugalTime.getDay()
      const tempoAtualEmMinutos = portugalTime.getHours() * 60 + portugalTime.getMinutes()

      const horarioAbertura = diaSemanaAtual === 0 || diaSemanaAtual === 2 || diaSemanaAtual === 3
        ? 17 * 60 + 30  // 17:30
        : 17 * 60      // 17:00

      const horarioFechamento = 22 * 60 // 22:00
      const isDentroHorario = tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento
      const isDiaAberto = diaSemanaAtual >= 2 && diaSemanaAtual <= 6 && isDentroHorario
    }

    verificarHorarioFuncionamento()
    const interval = setInterval(verificarHorarioFuncionamento, 60000)

    return () => clearInterval(interval)
  }, [])

  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isRegionSelected,
    setIsRegionSelected,
    deliveryWarningMessage,
    setDeliveryWarningMessage,
    isPickupActive,
    setIsPickupActive,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    register,
    errors,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    isCouponAvailable,
    coordenadas,
    setLojaSelecionada,
    lojaSelecionada,
    setCoordenadas,
    pagamentoNaEntrega,
    setPagamentoNaEntrega,
    handleDefaultShippingAddress,
    setFormaDePagamento,
    setScheduledDelivery,
    setSelectedOption,
    selectedOption,
    formaDePagamento,
    selectedShippingOption,
    setSelectedShippingOption
  } = useCheckoutSubmit()

  const queryClient = useQueryClient()

  React.useEffect(() => {
    queryClient.prefetchQuery(
      ["storeSetting"], // Changed from "storeSetting" to ["storeSetting"]
      async () => await SettingServices.getStoreSetting(),
      { staleTime: 4 * 60 * 1000 }
    )
  }, [queryClient])

  const handleMapRegionSelect = (cost) => {
    setSelectedMapShippingCost(cost)
    handleShippingCost(cost)
    setIsMapModalOpen(false)
    setIsRegionSelected(true)
    checkEnableOrderButton()
  }

  // Função para verificar e atualizar o estado do botão "Confirmar Pedido"
  // const checkEnableOrderButton = () => {
  //   let isFormValid = true // Começamos assumindo que o formulário é válido

  //   if (isPickupActive) { // Se "Retirada na Loja" está ATIVA
  //     const camposObrigatoriosRetirada = ['firstName', 'lastName', 'nif', 'contact', 'email']
  //     for (const campo of camposObrigatoriosRetirada) {
  //       if (errors[campo]) { // Se houver erro em algum campo OBRIGATÓRIO para Retirada, formulário é inválido
  //         isFormValid = false
  //         break // Não precisa verificar mais campos se já encontrou um erro
  //       }
  //     }
  //   } else { // Se "Retirada na Loja" está DESATIVADA (entrega normal)
  //     const camposObrigatoriosEntrega = ['firstName', 'lastName', 'nif', 'contact', 'email', 'address', 'city', 'zipCode', 'country'] // Campos obrigatórios normais
  //     for (const campo of camposObrigatoriosEntrega) {
  //       if (errors[campo]) { // Se houver erro em algum campo OBRIGATÓRIO para Entrega, formulário é inválido
  //         isFormValid = false
  //         break // Não precisa verificar mais campos se já encontrou um erro
  //       }
  //     }

  //     // Verifica se tem frete selecionado e pagamento na entrega
  //     if (pagamentoNaEntrega && shippingCost > 0) {
  //       isFormValid = true
  //     }

  //     // Verifica se tem região selecionada
  //     if (!shippingCost && !isPickupActive) {
  //       isFormValid = false
  //     }

  //     if (selectedShippingOption !== 'Delivery' && !pagamentoNaEntrega) {
  //       isFormValid = false
  //     }

  //     if (selectedMapShippingCost <= 0) { // Se frete não foi selecionado, inválido também
  //       isFormValid = false
  //     }

  //     if (pagamentoNaEntrega && formaDePagamento.method === null) { // Se pagamento na entrega e método não selecionado, inválido
  //       isFormValid = false
  //     }
  //   }
  //   setIsOrderButtonEnabled(isFormValid) // Atualiza o estado do botão baseado na validade do form
  // }

  const checkEnableOrderButton = () => {
    let isFormValid = true

    if (isPickupActive) {
      const camposObrigatoriosRetirada = ['firstName', 'lastName', 'nif', 'contact', 'email']
      isFormValid = !camposObrigatoriosRetirada.some(campo => errors[campo])
    } else {
      const camposObrigatoriosEntrega = ['firstName', 'lastName', 'nif', 'contact', 'email', 'address', 'city', 'zipCode', 'country']
      isFormValid = !camposObrigatoriosEntrega.some(campo => errors[campo])

      // Verifica condições de entrega
      if (pagamentoNaEntrega) {
        isFormValid = isFormValid && shippingCost > 0
      }

      if(selectedShippingOption === "Delivery" && shippingCost > 0){
        isFormValid = true
      }

      // Verifica se região foi selecionada
      if (!isRegionSelected && !isPickupActive) {
        isFormValid = false
      }
    }

    setIsOrderButtonEnabled(isFormValid)
  }

  const handleOpenMapModal = () => {
    setIsMapModalOpen(true)
  }

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
  }
  const handlePaymentMethodSelect = (paymentMethod) => {
    setFormaDePagamento(paymentMethod)
    setIsPaymentModalOpen(false)
    checkEnableOrderButton()
  }

  const getGeolocation = async () => {
    setLoading(true)
    setErrorMessage("")

    if (!navigator.geolocation) {
      setErrorMessage("Seu navegador não suporta geolocalização")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          setCoordenadas(`${latitude},${longitude}`)
          setFreteCoordenadas(`${latitude},${longitude}`)

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )

          if (!response.ok) {
            throw new Error("Falha ao obter dados do endereço")
          }

          const data = await response.json()

          setAddress(prevAddress => ({
            ...prevAddress,
            street: data.address?.road || "",
            city: data.address?.city || "",
            country: data.address?.country || "",
            zipCode: data.address?.postcode || "",
          }))

        } catch (error) {
          console.error("Erro detalhado:", error)
          setErrorMessage("Não foi possível obter seu endereço. Tente novamente.")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error)
        setErrorMessage("Erro ao obter sua localização. Verifique as permissões.")
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option)
    if (option === 'Delivery') {
      setPagamentoNaEntrega(false)
      // Only update shipping cost, don't trigger form submission
      handleShippingCost(selectedMapShippingCost)
    }
    if (option === 'delivery') {
      setPagamentoNaEntrega(true)
      handleOpenPaymentModal()
      handleShippingCost(selectedMapShippingCost)
    }
  }

  const handlePickupToggle = (value) => {
    handleDefaultShippingAddress(value)
    setIsPickupActive(value)
    checkEnableOrderButton() // Update button state
    if (value) {
      handleShippingCost(0) // Set shipping cost to 0 when pickup is active
    } else {
      handleShippingCost(selectedMapShippingCost) // Restore selected shipping cost when pickup is inactive, or default 6 if none selected before.
    }
  }

  const handleShippingOptionChange = (value, cost, isChecked) => {
    setSelectedShippingOption(isChecked ? value : null)
    if (isChecked) {
      if (value === 'Delivery') {
        handleShippingCost(cost)
        setIsRegionSelected(true)
      } else {
        handleShippingCost(0)
      }
    } else {
      handleShippingCost(0)
    }
    checkEnableOrderButton()
  }

  const handlePagamentoNaEntregaChange = (event) => {
    setPagamentoNaEntrega(event.target.checked)
    if (event.target.checked && shippingCost <= 0)  {
      setDeliveryWarningMessage("Selecione o valor do frete em Delivery")
    } else {
      setDeliveryWarningMessage("")
    }
    checkEnableOrderButton()
  }

  React.useEffect(() => {
    if (selectedOption === 'Delivery' || selectedOption === 'delivery') {
      // Mantém o valor do frete selecionado para ambas as opções
      handleShippingCost(selectedMapShippingCost)
    } else if (isPickupActive) {
      handleShippingCost(0)
    }
  }, [selectedOption, selectedMapShippingCost, handleShippingCost, isPickupActive])

  React.useEffect(() => {
    checkEnableOrderButton()
}, [selectedMapShippingCost, selectedMapShippingCost, isPickupActive, pagamentoNaEntrega, formaDePagamento])

  React.useEffect(() => {
    const storedLojaSelecionada = localStorage.getItem("selectedStore")
    if (storedLojaSelecionada) {
      setLojaSelecionada(storedLojaSelecionada)
    }
  }, [lojaSelecionada])

  return (
    <>
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
            <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="flex justify-end my-2">
                    <SwitchToggle
                      id="shipping-address"
                      title="Retirada na Loja?"
                      processOption={useExistingAddress}
                      handleProcess={handlePickupToggle} // Use the new toggle handler
                    />
                  </div>
                  <div className="form-group">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      01.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.personal_details
                      )}
                    </h2>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.first_name
                          )}
                          name="firstName"
                          type="text"
                          placeholder="John"
                          required={true} // Always required
                        />
                        <Error errorName={errors.firstName} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.last_name
                          )}
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          required={false} // Always optional
                        />
                        <Error errorName={errors.lastName} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.email_address
                          )}
                          name="email"
                          type="email"
                          placeholder="youremail@gmail.com"
                          value={address.email || ""}
                          onChange={(e) => {
                            setAddress({ ...address, email: e.target.value })
                          }}
                        />
                        <Error errorName={errors.email} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.checkout_phone
                          )}
                          name="contact"
                          type="tel"
                          placeholder="+062-6532956"
                          required={true} // Always required
                        />
                        <Error errorName={errors.contact} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="NIF"
                          name="nif"
                          type="text"
                          placeholder="Digite o número do seu NIF"
                          required={true} // Always required
                          value={address.nif || ""}
                          onChange={(e) => {
                            setAddress({ ...address, nif: e.target.value })
                          }}
                        />
                        <Error errorName={errors.nif} />
                      </div>
                    </div>
                  </div>
                  {!isPickupActive && ( // Conditionally render shipping details
                    <div className="form-group mt-12">
                      <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                        02.{" "}
                        {showingTranslateValue(
                          storeCustomizationSetting?.checkout?.shipping_details
                        )}
                      </h2>
                      <div className="grid grid-cols-6 gap-6 mb-8">
                        <div className="col-span-6">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.street_address
                            )}
                            name="address"
                            type="text"
                            placeholder="123 Boulevard Rd, Beverley Hills"
                            value={address.street || ""}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            required={!isPickupActive} // Conditionally required
                            isPickupActive={isPickupActive} // Pass prop for conditional validation
                          />
                          <Error errorName={errors.address} />
                        </div>
                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.city
                            )}
                            name="city"
                            type="text"
                            placeholder="Los Angeles"
                            value={address.city || ""}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            required={!isPickupActive} // Conditionally required
                            isPickupActive={isPickupActive} // Pass prop for conditional validation
                          />
                          <Error errorName={errors.city} />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.country
                            )}
                            name="country"
                            type="text"
                            placeholder="United States"
                            value={address.country || ""}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            required={!isPickupActive} // Conditionally required
                            isPickupActive={isPickupActive} // Pass prop for conditional validation
                          />
                          <Error errorName={errors.country} />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <InputArea
                            register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.checkout?.zip_code
                            )}
                            name="zipCode"
                            type="text"
                            placeholder="2345"
                            value={address.zipCode || ""}
                            onChange={(e) => {
                              setAddress({ ...address, zipCode: e.target.value })
                            }}
                            required={!isPickupActive} // Conditionally required
                            isPickupActive={isPickupActive} // Pass prop for conditional validation
                          />
                          <Error errorName={errors.zipCode} />
                        </div>
                        {/* informações adicionais */}
                        <div className="col-span-6">
                          <InputArea
                            register={register}
                            label="Informações adicionais"
                            name="additionalInformation"
                            type="textarea"
                            rows={4}
                            placeholder="Informações adicionais"
                            value={address.additionalInformation || ""}
                            onChange={(e) => {
                              setAddress({ ...address, additionalInformation: e.target.value })
                            }}
                            required={false} // Always optional
                            isPickupActive={isPickupActive} // Pass prop for conditional validation
                          />
                          <Error errorName={errors.additionalInformation} />
                        </div>
                      </div>
                      <div className="flex row max-[768px]:flex-col gap-2 justify-between items-center">
                        <button
                          type="button"
                          onClick={getGeolocation}
                          disabled={loading}
                          className="mt-4 mb-4 bg-customRed hover:bg-red-500 border border-customRed  text-white px-4 py-2 rounded"
                        >
                          <p className="text-sm font-semibold">
                            {loading ? "Carregando..." : "Compartilhar minha localização"}
                          </p>
                        </button>
                        <div className="mt-4 flex row items-center mb-4 bg-customRed border border-customRed text-sm text-white px-4 py-2 rounded">
                          <IoMapSharp style={{ width: 25, height: 25 }} />
                          <p className="col-span-6 sm:col-span-3 ml-2 bg-customRed">
                            {coordenadas}
                          </p>
                        </div>
                      </div>
                    </div>
                  )} {/* End conditional rendering of shipping details */}
             
                  {!isPickupActive && (
                    <>
                      <div className="mt-4">
                        <Label
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.shipping_cost
                          )}
                        />
                      </div>
                      <div className="grid gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          {/* entrega com Frete */}
                          <InputShipping
                            currency={currency}
                            handleShippingCost={handleShippingOptionChange}
                            register={register}
                            checked={selectedShippingOption === 'Delivery'}
                            value="Delivery"
                            time="Today"
                            cost={selectedMapShippingCost}
                            onOpenModal={handleOpenMapModal} // Prop to open modal
                          />
                          <Error errorName={errors.shippingOption} />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          {/* Pagamento na entrega */}
                          <InputDelivery
                            onChange={handlePagamentoNaEntregaChange}
                            checked={pagamentoNaEntrega}
                            register={register}
                            value={pagamentoNaEntrega}
                            type="checkbox"
                            Icon={FaHome}
                            name="Pagamento na Entrega"
                            onClick={handleOpenPaymentModal}
                            warningMessage={deliveryWarningMessage}
                            isRegionSelected={isRegionSelected}
                            setDeliveryWarningMessage={setDeliveryWarningMessage}
                            handleOpenPaymentModal={handleOpenPaymentModal}
                          />
                          <Error errorName={errors.shippingOption} />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-span-6 sm:col-span-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsAgendamentoModalOpen(true)}
                      className="bg-customRed hover:bg-red-400 border transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
                    >
                      <IoCalendarOutline className="mr-2 text-xl" />
                      Agendar Pedido
                    </button>
                    {/* colocar uma flag de exclamação aqui com texto opcional */}
                    <p className="text-md text-gray-500 mt-1">
                      Opcional
                    </p>
                  </div>

                  {/* Map Region Modal Component */}
                  <MapCheckoutModal
                    isOpen={isMapModalOpen}
                    onClose={() => setIsMapModalOpen(false)}
                    onSelectRegion={handleMapRegionSelect}
                  />
                  {/* Payment Method Modal Component */}
                  <PaymentMethodModal
                    isOpen={isPaymentModalOpen}
                    onClose={handleClosePaymentModal}
                    onPaymentMethodSelect={handlePaymentMethodSelect}
                  />
                  {/* Agendamento Modal Component */}
                  <AgendamentoModal
                    isOpen={isAgendamentoModalOpen}
                    onClose={() => setIsAgendamentoModalOpen(false)}
                    onScheduleSelect={(schedule) => {
                      setScheduledDelivery(schedule)
                      setIsAgendamentoModalOpen(false)
                    }}
                  />
                  <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                    <div className="col-span-6 sm:col-span-3">
                      <Link
                        href="/"
                        className="bg-indigo-50 border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center font-serif w-full"
                      >
                        <span className="text-xl mr-2">
                          <IoReturnUpBackOutline />
                        </span>
                        {/* {showingTranslateValue(storeCustomizationSetting?.checkout?.continue_button)} */}
                        Continuar Comprando
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={isEmpty || isCheckoutSubmit || !isOrderButtonEnabled}
                      className={`${isEmpty || isCheckoutSubmit || !isOrderButtonEnabled
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-customRed hover:bg-red-500'}
                        border border-customRed transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full col-span-6 sm:col-span-3
                        `}>
                      {isCheckoutSubmit ? (
                        <span className="flex justify-center text-center">
                          <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
                          <span className="ml-2">{t("common:processing")}</span>
                        </span>
                      ) : (
                        <span className="flex justify-center text-center">
                          Confirmar Pedido
                          <span className="text-xl ml-2"><IoArrowForward /></span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-28 md:order-2 lg:order-2">
              <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
                <h2 className="font-semibold font-serif text-lg pb-4">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.order_summary
                  )}
                </h2>
                <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 block">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} currency={currency} />
                  ))}
                  {isEmpty && (
                    <div className="text-center py-10">
                      <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
                        <IoBagHandle />
                      </span>
                      <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
                        Nenhum item adicionado ainda!
                      </h2>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
                  <form className="w-full">
                    {couponInfo.couponCode ? (
                      <span className="bg-emerald-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                        {" "}
                        <p className="text-customRed">Cupom aplicado </p>{" "}
                        <span className="text-red-500 text-right">
                          {couponInfo.couponCode}
                        </span>
                      </span>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start justify-end">
                        <input
                          ref={couponRef}
                          type="text"
                          placeholder={t("common:couponCode")}
                          className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-customRed placeholder-gray-500 placeholder-opacity-75"
                        />
                        {isCouponAvailable ? (
                          <button
                            disabled={isCouponAvailable}
                            type="submit"
                            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-customRed h-12 text-sm lg:text-base w-full sm:w-auto"
                          >
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={10}
                            />
                            <span className=" ml-2 font-light">Processando</span>
                          </button>
                        ) : (
                          <button
                            disabled={isCouponAvailable}
                            onClick={handleCouponCode}
                            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-customRed h-12 text-sm lg:text-base w-full sm:w-auto"
                          >
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.apply_button
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.sub_total
                  )}
                  <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                    {currency}
                    {cartTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.shipping_cost
                  )}
                  <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                    {currency}
                    {shippingCost?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.discount
                  )}
                  <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                    {currency}
                    {discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t mt-4">
                  <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.total_cost
                    )}
                    <span className="font-serif font-extrabold text-lg">
                      {currency}
                      {parseFloat(total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Checkout), { ssr: false })