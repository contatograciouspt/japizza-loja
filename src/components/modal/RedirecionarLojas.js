import React, { Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"

export default function RedirecionarLojas({ onStoreSelect }) {
    const [open, setOpen] = React.useState(false)

    const lojaPortimao = `37°08'12.6"N 8°32'25.6"W`
    const lojaMexilhoeira = `37°09'30.3"N 8°36'51.5"W`

    const handleOpen = () => {
        const hasSelectedStore = localStorage.getItem('selectedStore')
        if (!hasSelectedStore) {
            setOpen(true)
        }
    }

    const handleStoreSelection = (store) => {
        if (store === 'portimao') {
            localStorage.setItem('selectedStore', 'portimao')
            localStorage.setItem('coordinates', lojaPortimao)
        } else if (store === 'mexilhoeira') {
            localStorage.setItem('selectedStore', 'mexilhoeira')
            localStorage.setItem('coordinates', lojaMexilhoeira)
        }
        setOpen(false)
        onStoreSelect?.() // Chama o callback após seleção
    }


    useEffect(() => {
        handleOpen()
    }, [])

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl justify-center flex font-medium leading-6 text-gray-900">
                                    Qual loja você deseja fazer um pedido?
                                </Dialog.Title>
                                <div className="flex justify-around mt-4">
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => handleStoreSelection('portimao')}
                                        >
                                            <p className="font-bold">
                                                Portimão
                                            </p>
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={() => handleStoreSelection('mexilhoeira')}
                                        >
                                            <p className="font-bold">
                                                Mexilhoeira
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
