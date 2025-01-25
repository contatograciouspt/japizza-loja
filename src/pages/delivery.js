import React from "react"
import { FaCircleCheck } from "react-icons/fa6";

export default function SuccessPage() {
    React.useEffect(() => {
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }, []);

    return (
        <div
            className="bg-white px-6 py-10 lg:py-20 h-screen flex flex-wrap content-center">
            <div className="block justify-items-center mx-auto items-center text-center">
                <FaCircleCheck
                    width={100}
                    height={100}
                    color="green"
                    style={{ width: 60, height: 60 }}
                />
                <h1 className="font-bold font-serif font-2xl lg:text-3xl leading-6 mt-4 mb-4">
                    Pedido confirmado.
                </h1>
                <h1 className="font-bold font-serif font-2xl lg:text-3xl leading-6 mt-4 mb-4">
                    Estamos preparando, em breve iremos notificar você!
                </h1>
                <p className="block text-center font-semibold text-base font-sans text-gray-600">
                    Redirecionando...
                </p>
            </div>
        </div>
    )
}