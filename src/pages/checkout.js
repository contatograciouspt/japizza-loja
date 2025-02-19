// import React from "react"
// import dynamic from "next/dynamic"
// import Link from "next/link"
// import { useQueryClient } from "@tanstack/react-query"
// import { FaHome } from "react-icons/fa"
// import useTranslation from "next-translate/useTranslation"
// import { IoReturnUpBackOutline, IoArrowForward, IoBagHandle, IoMapSharp } from "react-icons/io5"

// //internal import
// import Layout from "@layout/Layout"
// import Label from "@components/form/Label"
// import Error from "@components/form/Error"
// import CartItem from "@components/cart/CartItem"
// import InputArea from "@components/form/InputArea"
// import useGetSetting from "@hooks/useGetSetting"
// import InputShipping from "@components/form/InputShipping"
// import useCheckoutSubmit from "@hooks/useCheckoutSubmit"
// import useUtilsFunction from "@hooks/useUtilsFunction"
// import SettingServices from "@services/SettingServices"
// import SwitchToggle from "@components/form/SwitchToggle"
// import InputDelivery from "@components/form/InputDelivery"
// import MapCheckoutModal from "@components/modal/MapCheckoutModal"

// const Checkout = () => {
//   const { t } = useTranslation()
//   const { storeCustomizationSetting } = useGetSetting()
//   const { showingTranslateValue } = useUtilsFunction()
//   const [loading, setLoading] = React.useState(false)
//   const [errorMessage, setErrorMessage] = React.useState("")
//   const [address, setAddress] = React.useState({ street: "", city: "", country: "", zipCode: "", additionalInformation: "" })
//   const [selectedOption, setSelectedOption] = React.useState(null) // Novo estado
//   const [isOptionSelected, setIsOptionSelected] = React.useState(false)
//   const [isMapModalOpen, setIsMapModalOpen] = React.useState(false)
//   const [selectedMapShippingCost, setSelectedMapShippingCost] = React.useState(0)
//   const [freteCoordenadas, setFreteCoordenadas] = React.useState("")

//   const coordenadaMexilhoeira = `37°09'30.3"N 8°36'51.5"W`

//   const handleMapRegionSelect = (cost) => {
//     setSelectedMapShippingCost(cost)
//     handleShippingCost(cost)
//     setIsMapModalOpen(false)
//   }

//   const handleOpenMapModal = () => { // Function to open modal
//     setIsMapModalOpen(true)
//   }

//   const { } = useQueryClient({
//     queryKey: ["storeSetting"],
//     queryFn: async () => await SettingServices.getStoreSetting(),
//     staleTime: 4 * 60 * 1000, // Api request after 4 minutes
//   })

//   // Função para obter localização do usuário
//   const getGeolocation = async () => {
//     setLoading(true)
//     setErrorMessage("") // Limpa mensagens de erro anteriores

//     if (!navigator.geolocation) {
//       setErrorMessage("Seu navegador não suporta geolocalização")
//       setLoading(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords
//           // console.log("Latitude:", latitude, "Longitude:", longitude)

//           setCoordenadas(`${latitude},${longitude}`)
//           setFreteCoordenadas(`${latitude},${longitude}`)

//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           )

//           if (!response.ok) {
//             throw new Error("Falha ao obter dados do endereço")
//           }

//           const data = await response.json()

//           // Validação e tratamento dos dados
//           const novoEndereco = {
//             street: data.address?.road || "",
//             city: data.address?.city || "",
//             country: data.address?.country || "",
//             zipCode: data.address?.postcode || "",
//           }

//           setAddress(novoEndereco)

//         } catch (error) {
//           console.error("Erro detalhado:", error)
//           setErrorMessage("Não foi possível obter seu endereço. Tente novamente.")
//         } finally {
//           setLoading(false)
//         }
//       },
//       (error) => {
//         console.error("Erro de geolocalização:", error)
//         setErrorMessage("Erro ao obter sua localização. Verifique as permissões.")
//         setLoading(false)
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     )
//   }

//   const {
//     couponInfo,
//     couponRef,
//     total,
//     isEmpty,
//     items,
//     cartTotal,
//     currency,
//     register,
//     errors,
//     setShowCard,
//     handleSubmit,
//     submitHandler,
//     handleShippingCost,
//     handleCouponCode,
//     discountAmount,
//     shippingCost,
//     isCheckoutSubmit,
//     useExistingAddress,
//     hasShippingAddress,
//     isCouponAvailable,
//     coordenadas,
//     setCoordenadas,
//     pagamentoNaEntrega,
//     setPagamentoNaEntrega,
//     handleDefaultShippingAddress,
//   } = useCheckoutSubmit()

//   const handleOptionChange = (option) => {
//     setSelectedOption(option)
//     if (option === 'delivery') {
//       setPagamentoNaEntrega(!pagamentoNaEntrega)
//       handleShippingCost(0)

//     }
//     if (option === 'shipping') {
//       setPagamentoNaEntrega(false)
//       handleShippingCost(selectedMapShippingCost)
//     }
//   }

//   React.useEffect(() => {
//     if (selectedOption === 'Frete') {
//       handleShippingCost(selectedMapShippingCost) // Ensure shippingCost is updated if option is shipping
//     } else if (selectedOption === 'delivery') {
//       handleShippingCost(0)
//     }
//   }, [selectedOption, selectedMapShippingCost, handleShippingCost]) // Depend on selectedMapShippingCost

//   return (
//     <>
//       <Layout title="Checkout" description="this is checkout page">
//         <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
//           <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
//             <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
//               <div className="mt-5 md:mt-0 md:col-span-2">
//                 <form onSubmit={handleSubmit(submitHandler)}>
//                   {hasShippingAddress && (
//                     <div className="flex justify-end my-2">
//                       <SwitchToggle
//                         id="shipping-address"
//                         title="Usar endereço de entrega padrão"
//                         processOption={useExistingAddress}
//                         handleProcess={handleDefaultShippingAddress}
//                       />
//                     </div>
//                   )}
//                   <div className="form-group">
//                     <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
//                       01.{" "}
//                       {showingTranslateValue(
//                         storeCustomizationSetting?.checkout?.personal_details
//                       )}
//                     </h2>

//                     <div className="grid grid-cols-6 gap-6">
//                       <div className="col-span-6 sm:col-span-3">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.first_name
//                           )}
//                           name="firstName"
//                           type="text"
//                           placeholder="John"
//                         />
//                         <Error errorName={errors.firstName} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.last_name
//                           )}
//                           name="lastName"
//                           type="text"
//                           placeholder="Doe"
//                           required={false}
//                         />
//                         <Error errorName={errors.lastName} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.email_address
//                           )}
//                           name="email"
//                           type="email"
//                           readOnly={true}
//                           placeholder="youremail@gmail.com"
//                         />
//                         <Error errorName={errors.email} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.checkout_phone
//                           )}
//                           name="contact"
//                           type="tel"
//                           placeholder="+062-6532956"
//                         />

//                         <Error errorName={errors.contact} />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="form-group mt-12">
//                     <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
//                       02.{" "}
//                       {showingTranslateValue(
//                         storeCustomizationSetting?.checkout?.shipping_details
//                       )}
//                     </h2>

//                     <div className="grid grid-cols-6 gap-6 mb-8">
//                       <div className="col-span-6">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.street_address
//                           )}
//                           name="address"
//                           type="text"
//                           placeholder="123 Boulevard Rd, Beverley Hills"
//                           value={address.street || ""}
//                           onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                         />
//                         <Error errorName={errors.address} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-6 lg:col-span-2">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.city
//                           )}
//                           name="city"
//                           type="text"
//                           placeholder="Los Angeles"
//                           value={address.city || ""}
//                           onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                         />
//                         <Error errorName={errors.city} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3 lg:col-span-2">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.country
//                           )}
//                           name="country"
//                           type="text"
//                           placeholder="United States"
//                           value={address.country || ""}
//                           onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                         />
//                         <Error errorName={errors.country} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3 lg:col-span-2">
//                         <InputArea
//                           register={register}
//                           label={showingTranslateValue(
//                             storeCustomizationSetting?.checkout?.zip_code
//                           )}
//                           name="zipCode"
//                           type="text"
//                           placeholder="2345"
//                           value={address.zipCode || ""}
//                           onChange={(e) => {
//                             setAddress({ ...address, zipCode: e.target.value })
//                           }}
//                         />
//                         <Error errorName={errors.zipCode} />
//                       </div>
//                       {/* informações adicionais */}
//                       <div className="col-span-6">
//                         <InputArea
//                           register={register}
//                           label="Informações adicionais"
//                           name="additionalInformation"
//                           type="textarea"
//                           rows={4}
//                           placeholder="Informações adicionais"
//                           value={address.additionalInformation || ""}
//                           onChange={(e) => {
//                             setAddress({ ...address, additionalInformation: e.target.value })
//                           }}
//                         />
//                         <Error errorName={errors.additionalInformation} />
//                       </div>
//                     </div>
//                     <div className="flex row max-[768px]:flex-col gap-2 justify-between items-center">
//                       <button
//                         type="button"
//                         onClick={getGeolocation}
//                         disabled={loading}
//                         className="mt-4 mb-4 bg-customRed hover:bg-red-500 border border-customRed  text-white px-4 py-2 rounded"
//                       >
//                         <p className="text-sm font-semibold">
//                           {loading ? "Carregando..." : "Preencher com minha localização"}
//                         </p>
//                       </button>
//                       <div className="mt-4 flex row items-center mb-4 bg-customRed border border-customRed text-sm text-white px-4 py-2 rounded">
//                         <IoMapSharp style={{ width: 25, height: 25 }} />
//                         <p className="col-span-6 sm:col-span-3 ml-2 bg-customRed">
//                           {coordenadas}
//                         </p>
//                       </div>
//                     </div>
//                     <Label
//                       label={showingTranslateValue(
//                         storeCustomizationSetting?.checkout?.shipping_cost
//                       )}
//                     />
//                     <div className="grid grid-cols-6 gap-6">
//                       <div className="col-span-6 sm:col-span-3">
//                         {/* entrega com Frete */}
//                         <InputShipping
//                           currency={currency}
//                           handleShippingCost={handleOptionChange}
//                           register={register}
//                           checked={selectedOption === 'Frete'}
//                           value="Frete"
//                           time="Today"
//                           cost={selectedMapShippingCost}
//                           disabled={isOptionSelected}
//                           onOpenModal={handleOpenMapModal}
//                         />
//                         <Error errorName={errors.shippingOption} />
//                       </div>

//                       <div className="col-span-6 sm:col-span-3">
//                         {/* Pagamento na entrega */}
//                         <InputDelivery
//                           onChange={() => { handleOptionChange("delivery") }}
//                           checked={selectedOption === 'delivery'}
//                           register={register}
//                           value={pagamentoNaEntrega}
//                           type="radio"
//                           Icon={FaHome}
//                           name="Pagamento na Entrega"
//                         />
//                         <Error errorName={errors.shippingOption} />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Modal Component */}
//                   <MapCheckoutModal
//                     isOpen={isMapModalOpen}
//                     onClose={() => setIsMapModalOpen(false)}
//                     onSelectRegion={handleMapRegionSelect}
//                   />
//                   <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
//                     <div className="col-span-6 sm:col-span-3">
//                       <Link
//                         href="/"
//                         className="bg-indigo-50 border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center font-serif w-full"
//                       >
//                         <span className="text-xl mr-2">
//                           <IoReturnUpBackOutline />
//                         </span>
//                         {showingTranslateValue(
//                           storeCustomizationSetting?.checkout?.continue_button
//                         )}
//                       </Link>
//                     </div>
//                     <div className="col-span-6 sm:col-span-3">
//                       <button
//                         type="submit"
//                         disabled={isEmpty || isCheckoutSubmit}
//                         className="bg-customRed hover:bg-red-500 border border-customRed transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
//                       >
//                         {isCheckoutSubmit ? (
//                           <span className="flex justify-center text-center">
//                             {" "}
//                             <img
//                               src="/loader/spinner.gif"
//                               alt="Loading"
//                               width={20}
//                               height={10}
//                             />{" "}
//                             <span className="ml-2">
//                               {t("common:processing")}
//                             </span>
//                           </span>
//                         ) : (
//                           <span className="flex justify-center text-center">
//                             {showingTranslateValue(
//                               storeCustomizationSetting?.checkout
//                                 ?.confirm_button
//                             )}
//                             <span className="text-xl ml-2">
//                               {" "}
//                               <IoArrowForward />
//                             </span>
//                           </span>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-28 md:order-2 lg:order-2">
//               <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
//                 <h2 className="font-semibold font-serif text-lg pb-4">
//                   {showingTranslateValue(
//                     storeCustomizationSetting?.checkout?.order_summary
//                   )}
//                 </h2>

//                 <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 block">
//                   {items.map((item) => (
//                     <CartItem key={item.id} item={item} currency={currency} />
//                   ))}

//                   {isEmpty && (
//                     <div className="text-center py-10">
//                       <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
//                         <IoBagHandle />
//                       </span>
//                       <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
//                         Nenhum item adicionado ainda!
//                       </h2>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
//                   <form className="w-full">
//                     {couponInfo.couponCode ? (
//                       <span className="bg-emerald-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
//                         {" "}
//                         <p className="text-customRed">Cupom aplicado </p>{" "}
//                         <span className="text-red-500 text-right">
//                           {couponInfo.couponCode}
//                         </span>
//                       </span>
//                     ) : (
//                       <div className="flex flex-col sm:flex-row items-start justify-end">
//                         <input
//                           ref={couponRef}
//                           type="text"
//                           placeholder={t("common:couponCode")}
//                           className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-customRed placeholder-gray-500 placeholder-opacity-75"
//                         />
//                         {isCouponAvailable ? (
//                           <button
//                             disabled={isCouponAvailable}
//                             type="submit"
//                             className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-customRed h-12 text-sm lg:text-base w-full sm:w-auto"
//                           >
//                             <img
//                               src="/loader/spinner.gif"
//                               alt="Loading"
//                               width={20}
//                               height={10}
//                             />
//                             <span className=" ml-2 font-light">Processing</span>
//                           </button>
//                         ) : (
//                           <button
//                             disabled={isCouponAvailable}
//                             onClick={handleCouponCode}
//                             className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-customRed h-12 text-sm lg:text-base w-full sm:w-auto"
//                           >
//                             {showingTranslateValue(
//                               storeCustomizationSetting?.checkout?.apply_button
//                             )}
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </form>
//                 </div>
//                 <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
//                   {showingTranslateValue(
//                     storeCustomizationSetting?.checkout?.sub_total
//                   )}
//                   <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
//                     {currency}
//                     {cartTotal?.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
//                   {showingTranslateValue(
//                     storeCustomizationSetting?.checkout?.shipping_cost
//                   )}
//                   <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
//                     {currency}
//                     {shippingCost?.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
//                   {showingTranslateValue(
//                     storeCustomizationSetting?.checkout?.discount
//                   )}
//                   <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
//                     {currency}
//                     {discountAmount.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="border-t mt-4">
//                   <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
//                     {showingTranslateValue(
//                       storeCustomizationSetting?.checkout?.total_cost
//                     )}
//                     <span className="font-serif font-extrabold text-lg">
//                       {currency}
//                       {parseFloat(total).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </>
//   )
// }

// export default dynamic(() => Promise.resolve(Checkout), { ssr: false })

import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { FaHome, FaStoreAlt } from "react-icons/fa"
import useTranslation from "next-translate/useTranslation"
import { IoReturnUpBackOutline, IoArrowForward, IoBagHandle } from "react-icons/io5"
import { FiTruck } from "react-icons/fi";
import { Ring } from '@uiball/loaders'

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

const Checkout = () => {
  const { t } = useTranslation()
  const { storeCustomizationSetting } = useGetSetting()
  const { showingTranslateValue } = useUtilsFunction()
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [address, setAddress] = React.useState({
    street: "",
    city: "",
    country: "",
    zipCode: "",
    additionalInformation: "",
    nif: 0,
  })
  const [selectedOption, setSelectedOption] = React.useState(null)
  const [isOptionSelected, setIsOptionSelected] = React.useState(false)
  const [selectedMapShippingCost, setSelectedMapShippingCost] = React.useState(0)
  const [freteCoordenadas, setFreteCoordenadas] = React.useState("")
  const [coordenadas, setCoordenadas] = React.useState("");
  const [localShippingCost, setLocalShippingCost] = React.useState(0);
  const [calculatingShipping, setCalculatingShipping] = React.useState(false);

  const coordenadaMexilhoeira = { latitude: 37.1584, longitude: -8.6143 };

  const { } = useQueryClient({
    queryKey: ["storeSetting"],
    queryFn: async () => await SettingServices.getStoreSetting(),
    staleTime: 4 * 60 * 1000,
  })

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  const degToRad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const getGeolocationAndCalculateShipping = async () => {
    setCalculatingShipping(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Seu navegador não suporta geolocalização");
      setLocalShippingCost(0);
      setCalculatingShipping(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          setCoordenadas(`${latitude},${longitude}`);
          setFreteCoordenadas(`${latitude},${longitude}`);

          const distance = calculateDistance(latitude, longitude, coordenadaMexilhoeira.latitude, coordenadaMexilhoeira.longitude);

          let shippingCost = 0;
          if (distance >= 1 && distance <= 6) {
            shippingCost = Math.ceil(distance);
            setErrorMessage("");
          } else if (distance > 6 && distance <= 6.9) {
            setErrorMessage("Região não disponível para entrega");
            shippingCost = 0;
          } else if (distance > 6.9) {
            setErrorMessage("Região não disponível para entrega");
            shippingCost = 0;
          } else {
            setErrorMessage("");
            shippingCost = 0;
          }

          setLocalShippingCost(shippingCost);
          setSelectedMapShippingCost(shippingCost);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Falha ao obter dados do endereço");
          }

          const data = await response.json();

          const novoEndereco = {
            street: data.address?.road || "",
            city: data.address?.city || "",
            country: data.address?.country || "",
            zipCode: data.address?.postcode || "",
          };

          setAddress(novoEndereco);

        } catch (error) {
          console.error("Erro detalhado:", error);
          setErrorMessage("Não foi possível obter seu endereço. Tente novamente.");
          setLocalShippingCost(0);
          setSelectedMapShippingCost(0);
        } finally {
          setLoading(false);
          setCalculatingShipping(false);
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error);
        setErrorMessage("Erro ao obter sua localização. Verifique as permissões.");
        setLocalShippingCost(0);
        setSelectedMapShippingCost(0);
        setLoading(false);
        setCalculatingShipping(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  const {
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    register,
    errors,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    hasShippingAddress,
    isCouponAvailable,
    pagamentoNaEntrega,
    setPagamentoNaEntrega,
    handleDefaultShippingAddress,
  } = useCheckoutSubmit()


  const handleOptionChange = async (option, cost = 0) => {
    setSelectedOption(option);
    setIsOptionSelected(true);
    setPagamentoNaEntrega(false); // Desmarcar "Pagamento na Entrega" ao selecionar "Delivery" ou "Retirada na Loja"

    if (option === 'pickup') {
      handleShippingCost(0);
      setLocalShippingCost(0);
      setSelectedMapShippingCost(0);
      setErrorMessage("");
    } else if (option === 'delivery') {
      await getGeolocationAndCalculateShipping();
      handleShippingCost(localShippingCost);
    }
  };


  const handlePagamentoNaEntregaChange = async (e) => {
    const isChecked = e.target.checked;

    if (selectedOption === 'pickup') {
      setPagamentoNaEntrega(false);
      return;
    }

    setPagamentoNaEntrega(isChecked);
    setSelectedOption(isChecked ? 'delivery' : null); // Se marcar "Pagamanto na Entrega" seleciona "Delivery" e vice-versa

    if (isChecked) {
      await getGeolocationAndCalculateShipping(); // Calcula frete ao marcar "Pagamento na Entrega"
      handleShippingCost(localShippingCost);
    } else {
      if (selectedOption === 'delivery') {
        handleShippingCost(localShippingCost); // Mantem o frete caso desmarque "Pagamento na Entrega" e "Delivery" estava selecionado
      } else {
        handleShippingCost(0); // Zera o frete se desmarcar "Pagamento na Entrega" e nenhuma outra opção estiver selecionada
      }
    }
  };


  React.useEffect(() => {
    if (selectedOption === 'delivery') {
      handleShippingCost(localShippingCost);
    } else if (selectedOption === 'pickup') {
      handleShippingCost(0);
    } else if (selectedOption === null) {
      handleShippingCost(0);
    }
  }, [selectedOption, localShippingCost, handleShippingCost]);


  return (
    <>
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
            <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(submitHandler)}>
                  {hasShippingAddress && (
                    <div className="flex justify-end my-2">
                      <SwitchToggle
                        id="shipping-address"
                        title="Usar endereço de entrega padrão"
                        processOption={useExistingAddress}
                        handleProcess={handleDefaultShippingAddress}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      01.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.personal_details
                      )}
                    </h2>

                    <div className="grid grid-cols-6 gap-6">
                      {/* Inputs de detalhes pessoais - Sem alterações */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.first_name
                          )}
                          name="firstName"
                          type="text"
                          placeholder="John"
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
                          required={false}
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
                          readOnly={true}
                          placeholder="youremail@gmail.com"
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
                        />
                        <Error errorName={errors.contact} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          required={true}
                          register={register}
                          label="NIF"
                          name="nif"
                          type="number"
                          placeholder="Digite seu NIF"
                          value={address.nif || ""}
                          onChange={(e) => setAddress({ ...address, nif: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-12">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      02.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.shipping_details
                      )}
                    </h2>

                    <div className="grid grid-cols-6 gap-6 mb-8">
                      {/* Inputs de Endereço - Sem alterações */}
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
                          onChange={(e) => { setAddress({ ...address, zipCode: e.target.value }) }}
                        />
                        <Error errorName={errors.zipCode} />
                      </div>
                      {/* informações adicionais | observações */}
                      <div className="col-span-6">
                        <InputArea
                          required={false}
                          register={register}
                          label="Observações"
                          name="additionalInformation"
                          type="textarea"
                          rows={4}
                          placeholder="Informações adicionais"
                          value={address.additionalInformation || ""}
                          onChange={(e) => { setAddress({ ...address, additionalInformation: e.target.value }) }}
                        />
                        <Error errorName={errors.additionalInformation} />
                      </div>
                    </div>

                    <Label
                      label={showingTranslateValue(
                        storeCustomizationSetting?.checkout?.shipping_cost
                      )}
                    />
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <div className="flex flex-col gap-2 relative">
                          {/* Delivery */}
                          <InputShipping
                            currency={currency}
                            handleShippingCost={() => handleOptionChange('delivery')}
                            register={register}
                            checked={selectedOption === 'delivery'}
                            value="Delivery"
                            time="Today"
                            cost={localShippingCost}
                            description={`Custo de entrega: `}
                          />

                          {/* Retirada na Loja */}
                          <InputShipping
                            currency={currency}
                            handleShippingCost={() => handleOptionChange('pickup')}
                            register={register}
                            checked={selectedOption === 'pickup'}
                            value="Retirada na Loja"
                            time="Today"
                            cost={0}
                            Icon={FaStoreAlt}
                            description="Retire seu pedido na loja e economize no frete! "
                          />

                          {/* Pagamento na Entrega */}
                          <InputDelivery
                            onChange={handlePagamentoNaEntregaChange}
                            checked={pagamentoNaEntrega}
                            register={register}
                            value={pagamentoNaEntrega}
                            type="checkbox"
                            name="Pagamento na Entrega"
                            Icon={FaHome}
                            disabled={selectedOption === 'pickup'} // Disable if 'Retirada na Loja' is selected
                          />
                          {calculatingShipping && (
                            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-75 flex flex-col justify-center items-center">
                              <Ring color="#EF4444" size={50} />
                              <p className="mt-2 text-gray-600 text-sm">Calculando frete, aguarde...</p>
                            </div>
                          )}
                        </div>
                        <Error errorName={errors.shippingOption} />
                      </div>
                    </div>
                  </div>

                  {/* Botões de Continuar e Confirmar Pedido - Sem alterações */}
                  <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                    <div className="col-span-6 sm:col-span-3">
                      <Link
                        href="/"
                        className="bg-indigo-50 border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center font-serif w-full"
                      >
                        <span className="text-xl mr-2">
                          <IoReturnUpBackOutline />
                        </span>
                        {showingTranslateValue(
                          storeCustomizationSetting?.checkout?.continue_button
                        )}
                      </Link>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <button
                        type="submit"
                        disabled={isEmpty || isCheckoutSubmit || errorMessage !== ""}
                        className="bg-customRed hover:bg-red-500 border border-customRed transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
                      >
                        {isCheckoutSubmit ? (
                          <span className="flex justify-center text-center">
                            {" "}
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={10}
                            />{" "}
                            <span className="ml-2">
                              {t("common:processing")}
                            </span>
                          </span>
                        ) : (
                          <span className="flex justify-center text-center">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout
                                ?.confirm_button
                            )}
                            <span className="text-xl ml-2">
                              {" "}
                              <IoArrowForward />
                            </span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Resumo do Pedido - Sem alterações */}
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

                {/* ... Cupom e cálculo total - Sem alterações */}
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