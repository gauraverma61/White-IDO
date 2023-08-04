export interface IPaymentCurrency {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}
export const PaymentCurrencies: Record<number | string, IPaymentCurrency[]> = {
  default: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  ],
  42161: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  ],
  137: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "Matic",
      symbol: "Matic",
      decimals: 18,
    },
  ],
  80001: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "Matic",
      symbol: "Matic",
      decimals: 18,
    },
    // {
    //   address: "0x100E6469795D08cC45973ea66520F1A1EDe00c45",
    //   name: "Payment Token 1",
    //   symbol: "PYTKN1",
    //   decimals: 18,
    // },
    // {
    //   address: "0xd92D814eb5924595ba14913114d1bd3afB03B203",
    //   name: "Payment Token 2",
    //   symbol: "PYTKN2",
    //   decimals: 6,
    // },
    // {
    //   address: "0x97cB941E14128533645837Ccb8C4F6c7B806Ee49",
    //   name: "Payment Token 4",
    //   symbol: "PYTKN4",
    //   decimals: 18,
    // },
  ],
  1: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  ],
  56: [
    {
      address: "0x0000000000000000000000000000000000000000",
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  ],
};
