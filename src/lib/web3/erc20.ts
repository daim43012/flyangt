import { Contract } from "ethers";
import type { Eip1193Provider } from "$lib/wallet/provider";
import { getBrowserProvider, getSigner } from "./ethers";
import { ERC20_ABI } from "./abi/erc20.abi";

export function erc20Read(provider: Eip1193Provider, token: string) {
  return new Contract(token, ERC20_ABI, getBrowserProvider(provider));
}

export async function erc20Write(provider: Eip1193Provider, token: string) {
  return new Contract(token, ERC20_ABI, await getSigner(provider));
}

export async function erc20BalanceOf(provider: Eip1193Provider, token: string, owner: string) {
  const c: any = erc20Read(provider, token);
  return (await c.balanceOf(owner)) as bigint;
}

export async function erc20Allowance(
  provider: Eip1193Provider,
  token: string,
  owner: string,
  spender: string
) {
  const c: any = erc20Read(provider, token);
  return (await c.allowance(owner, spender)) as bigint;
}

export async function erc20Approve(
  provider: Eip1193Provider,
  token: string,
  spender: string,
  amount: bigint
) {
  const c: any = await erc20Write(provider, token);
  const tx = await c.approve(spender, amount);
  return await tx.wait();
}
