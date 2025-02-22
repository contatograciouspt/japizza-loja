import React from "react"
import axios from "axios"
import { useCart } from "react-use-cart"

const urlProduction = process.env.NEXT_PUBLIC_PRODUCTION_URL_PAYMENT
// const  urlDev = process.env.NEXT_PUBLIC_DEV_URL_PAYMENT

export default function usePaymentVivaWallet() {
    const [error, setError] = React.useState(null)
    const { emptyCart } = useCart()

    // Função para gerar o ordercode no servidor e gerar o pagamento
    const useVivaPayment = async (vivaPaymentData) => {
        try {
            // Realizar a requisição de pagamento
            const payment = await axios.post(urlProduction, vivaPaymentData)

            if (payment.status === 200) {
                const orderCode = payment.data.orderCode

                emptyCart() // Limpar o carrinho após a atualização bem-sucedida
                // Redirecionar para a tela de pagamento (APÓS atualizar o customer)
                window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`
            } else {
                console.error("Erro ao criar ordem de pagamento:", payment.status, payment.data)
                setError("Erro ao criar ordem de pagamento.  Por favor, tente novamente.")
            }
        } catch (err) {
            console.error("Erro geral ao criar ordem de pagamento:", err)
            setError("Erro inesperado ao processar o pagamento.  Por favor, tente novamente.")
        }
    }

    return {
        error,
        useVivaPayment,
    }
}

