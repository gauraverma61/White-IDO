export interface PoolResponse {
  data: PoolsDataResponse | PoolDataResponse;
}

export interface PoolsDataResponse {
  pools: Pool[];
}
export interface PoolDataResponse {
  pool: Pool;
}

interface Pool {
  id: string;
  addresses: null;
  logo: string;
  banner: string;
  cycle: null | string;
  cycleBps: null | string;
  description: null | string;
  endTime: string;
  feeIndex: string;
  finalFee: null;
  governance: string;
  hardCap: null | string;
  liquidityListingRate: null | string;
  liquidityLockDays: null | string;
  liquidityPercent: null | string;
  liquidityUnlockTime: null | string;
  max_payment: null | string;
  min_payment: null | string;
  payment_currency: Token;
  poolDetails: string;
  poolState: string;
  rate: null | string;
  refundType: null | string;
  router: null | string;
  socials: null;
  softCap: string;
  startTime: string;
  tgeBps: null | string;
  tier1EndTime: null | string;
  tier2EndTime: null | string;
  publicStartTime: null | string;
  token: Token | null;
  totalRaised: string;
  totalVolume: string;
  type: string;
  listingType: string;
  useWhitelisting: boolean | null;
  actualRaised: null;
  contributors: Contributor[];
}

interface Contributor {
  claimed: string;
  contribution: string;
  id: string;
  address: string;
  purchased: string;
  tier: null;
  whitelisted: null;
}

interface Token {
  decimals: string;
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  totalRaised?: string;
}
