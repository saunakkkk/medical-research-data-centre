// Private Medical Research Data Exchange API

import {
  type ContractAddress,
  type Logger,
  type BBoardContract,
  type BBoardProviders,
  type BBoardDerivedState,
  type DeployedBBoardContract,
  bboardPrivateStateKey,
} from './common-types.js';
import * as BBoard from '../../contract/src/index.js';
import { CompiledBBoardContractContract } from '../../contract/src/index.js';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from, type Observable } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { BBoardPrivateState, createBBoardPrivateState } from '../../contract/src/witnesses.js';

export const convertFieldToBytes = (len: number, num: bigint): Uint8Array => {
  const arr = new Uint8Array(len);
  let n = num;
  for (let i = len - 1; i >= 0; i--) {
    arr[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return arr;
};

export interface DeployedBBoardAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly deployedContract: DeployedBBoardContract;
  readonly state$: Observable<BBoardDerivedState>;

  registerDataset: (title: string) => Promise<void>;
  requestAccess: (datasetId: Uint8Array) => Promise<void>;
  grantPermission: (datasetId: Uint8Array, researcherPk: Uint8Array) => Promise<void>;
  submitAccessProof: (datasetId: Uint8Array, patientRecordHash: Uint8Array) => Promise<void>;
  revokeAccess: (datasetId: Uint8Array) => Promise<void>;
}

export class BBoardAPI implements DeployedBBoardAPI {
  private constructor(
    public readonly deployedContract: DeployedBBoardContract,
    providers: BBoardProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.deployedContractAddress);

    this.state$ = combineLatest(
      [
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => BBoard.ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                ledgerState: {
                  ...ledgerState,
                  owner: toHex(ledgerState.owner),
                  activeResearcherPk: toHex(ledgerState.activeResearcherPk),
                  lastProofHash: toHex(ledgerState.lastProofHash),
                },
              },
            }),
          ),
        ),
        from(providers.privateStateProvider.get(bboardPrivateStateKey) as Promise<BBoardPrivateState>),
      ],
      (ledgerState, privateState) => {
        const hashedSecretKey = BBoard.pureCircuits.publicKey(
          privateState.secretKey,
          convertFieldToBytes(32, ledgerState.sequence),
        );

        return {
          state: ledgerState.state,
          sequence: ledgerState.sequence,
          datasetTitle: ledgerState.datasetTitle.is_some ? ledgerState.datasetTitle.value : undefined,
          datasetCount: ledgerState.datasetCount,
          activeResearcherPk: ledgerState.activeResearcherPk,
          auditLogCount: ledgerState.auditLogCount,
          lastProofHash: ledgerState.lastProofHash,
          isOwner: toHex(ledgerState.owner) === toHex(hashedSecretKey),
        };
      },
    );
  }

  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<BBoardDerivedState>;

  async registerDataset(title: string): Promise<void> {
    this.logger?.info(`registerDataset: ${title}`);
    const txData = await this.deployedContract.callTx.registerDataset(title);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'registerDataset',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async requestAccess(datasetId: Uint8Array): Promise<void> {
    this.logger?.info('requestAccess');
    const txData = await this.deployedContract.callTx.requestAccess(datasetId);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'requestAccess',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async grantPermission(datasetId: Uint8Array, researcherPk: Uint8Array): Promise<void> {
    this.logger?.info('grantPermission');
    const txData = await this.deployedContract.callTx.grantPermission(datasetId, researcherPk);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'grantPermission',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async submitAccessProof(datasetId: Uint8Array, patientRecordHash: Uint8Array): Promise<void> {
    this.logger?.info('submitAccessProof');
    const txData = await this.deployedContract.callTx.submitAccessProof(datasetId, patientRecordHash);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'submitAccessProof',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async revokeAccess(datasetId: Uint8Array): Promise<void> {
    this.logger?.info('revokeAccess');
    const txData = await this.deployedContract.callTx.revokeAccess(datasetId);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'revokeAccess',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  static async deploy(providers: BBoardProviders, logger?: Logger): Promise<BBoardAPI> {
    logger?.info('deployContract');

    const deployedBBoardContract = await deployContract(providers, {
      compiledContract: CompiledBBoardContractContract,
      privateStateId: bboardPrivateStateKey,
      initialPrivateState: createBBoardPrivateState(utils.randomBytes(32)),
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedBBoardContract.deployTxData.public,
      },
    });

    return new BBoardAPI(deployedBBoardContract, providers, logger);
  }

  static async join(providers: BBoardProviders, contractAddress: ContractAddress, logger?: Logger): Promise<BBoardAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedBBoardContract = await findDeployedContract<BBoardContract>(providers, {
      contractAddress,
      compiledContract: CompiledBBoardContractContract,
      privateStateId: bboardPrivateStateKey,
      initialPrivateState: await BBoardAPI.getPrivateState(providers, contractAddress),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedBBoardContract.deployTxData.public,
      },
    });

    return new BBoardAPI(deployedBBoardContract, providers, logger);
  }

  private static async getPrivateState(
    providers: BBoardProviders,
    contractAddress: ContractAddress,
  ): Promise<BBoardPrivateState> {
    providers.privateStateProvider.setContractAddress(contractAddress);
    const existingPrivateState = await providers.privateStateProvider.get(bboardPrivateStateKey);
    return existingPrivateState ?? createBBoardPrivateState(utils.randomBytes(32));
  }
}

export * as utils from './utils/index.js';
export * from './common-types.js';
