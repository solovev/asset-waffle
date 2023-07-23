import { Contract, Interface, InterfaceAbi, JsonRpcProvider, Provider } from "ethers";
import { MULTICALL_ABI } from "./abi/multicall-abi";

export interface MulticallRequest {
  address: string;
  abi: InterfaceAbi;
  functionName: string;
  args: NonNullable<unknown>[];
  allowFailure?: boolean;
}

export interface MulticallResponse {
  success: boolean;
  data: NonNullable<unknown>;
}

interface Aggregate3Request {
  target: string;
  allowFailure: boolean;
  callData: NonNullable<unknown>;
}

interface Aggregate3Response {
  success: boolean;
  returnData: string;
}

type Aggregate3ReturnDataDecoder = (returnData: string) => NonNullable<unknown>;

export class Multicall {
  private interfaces: Interface[];
  private requestData: Aggregate3Request[];
  private responseDecoders: Aggregate3ReturnDataDecoder[];
  private contract: Contract;

  constructor(
    multicallAddress: string,
    provider: Provider,
    private requests: MulticallRequest[]
  ) {
    this.interfaces = this.createInterfaces();
    this.requestData = this.prepareRequestData();
    this.responseDecoders = this.createResponseDecoders();
    this.contract = new Contract(multicallAddress, MULTICALL_ABI, provider);
  }

  /**
   * Performs the multicall request.
   * @returns A list of responses that correspond the specified requests.
   */
  public async makeRequest(): Promise<MulticallResponse[]> {
    const results: Aggregate3Response[] =
      await this.contract.aggregate3.staticCall(this.requestData);
    return results.map(({ success, returnData }, index): MulticallResponse => ({ success, data: this.responseDecoders[index](returnData) }));
  }

  /**
   * Creates contract ABI interfaces.
   * @returns The list of interfaces.
   */

  private createInterfaces(): Interface[] {
    return this.requests.map(({ abi }) => new Interface(abi));
  }

  /**
   * Prepares the multicall request data.
   * @returns The encoded request data.
   */
  private prepareRequestData(): Aggregate3Request[] {
    return this.requests.map(
      (request, index): Aggregate3Request => ({
        target: request.address,
        allowFailure: request.allowFailure ?? true,
        callData: this.interfaces[index].encodeFunctionData(
          request.functionName,
          request.args
        ),
      })
    );
  }

  /**
   * Creates the multicall response decoders.
   * @returns The decoders list.
   */
  private createResponseDecoders(): Aggregate3ReturnDataDecoder[] {
    return this.requests.map(({ functionName }, index) => (returnData: string) =>
        this.interfaces[index].decodeFunctionResult(
          functionName,
          returnData
        )[0]);
  }
}

export async function makeMulticall(requests: MulticallRequest[]) {
  const multicallAddress = import.meta.env.VITE_MULTICALL_ADDRESS;
  const provider = new JsonRpcProvider(import.meta.env.VITE_RPC_URL);
  const multicall = new Multicall(multicallAddress, provider, requests);
  const responses = await multicall.makeRequest();
  return responses.map((response, index) => {
    return {
      request: requests[index],
      response: response,
    };
  });
}