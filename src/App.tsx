import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, TextField, Title, Icon } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import MasterChefABI from './MasterChef.json';
// @ts-ignore
import Web3 from 'web3';

const POLYGON_NETWORK_RPC = "https://polygon-rpc.com"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


const Container = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;

  > div:first-of-type {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const Rows = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const Card = styled.div`

  margin: 1rem;
  width: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justifty-content: center;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  background: none;
  margin-top: auto;
  > button {
    margin: 1rem;
  }

`

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const [rewardsContract, setRewardsContract] = useState<string>(ZERO_ADDRESS);
  const [ammFactory, setAmmFactory] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [marketFactory, setMarketFactory] = useState<string>('');
  const [rewardsPerMarket, setRewardsPerMarket] = useState<string>('');
  const [rewardDaysPerMarket, setRewardDaysPerMarket] = useState<string>('');
  const [earlyDepositBonusRewards, setEarlyDepositBonusRewards] = useState<string>('');
  const web3 = new Web3(POLYGON_NETWORK_RPC);
  const validRewardsAddress = rewardsContract
    && rewardsContract !== ZERO_ADDRESS
    && web3.utils.isAddress(rewardsContract)

  const contract = new web3.eth.Contract(MasterChefABI, validRewardsAddress ? rewardsContract : safe);

  const trustAMMFactoryTx = useCallback(async () => {
    console.log('contract', contract);
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: rewardsContract,
            value: '0',
            data: contract.methods.trustAMMFactory(ammFactory).encodeABI(),
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [contract.methods, rewardsContract, ammFactory, sdk])

  const unTrustAMMFactoryTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: rewardsContract,
            value: '0',
            data: contract.methods.untrustAMMFactory(ammFactory).encodeABI(),
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [contract.methods, rewardsContract, ammFactory, sdk])

  const withdrawRewardsTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: rewardsContract,
            value: '0',
            data: contract.methods.withdrawRewards(withdrawAmount).encodeABI(),
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [contract.methods, rewardsContract, withdrawAmount, sdk])

  const addRewardsTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: rewardsContract,
            value: '0',
            data: contract.methods.addRewards(marketFactory, rewardsPerMarket, rewardDaysPerMarket, earlyDepositBonusRewards).encodeABI(),
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [contract.methods, rewardsContract, marketFactory, rewardsPerMarket, rewardDaysPerMarket, earlyDepositBonusRewards, sdk])

  return (
    <Container>
      <div>
        <Title size="sm">
          MasterChef  <Icon size="md" type="collectibles"/> Rewards
        </Title>
      </div>

      {!validRewardsAddress && <div>
        <Rows>
          <Card>
            <TextField
              id="setRewardsContract"
              label="Please enter the Rewards Contract Address"
              value={rewardsContract}
              onChange={(e) => setRewardsContract(e.target.value)}
            />
          </Card>
        </Rows>
      </div>}

      {validRewardsAddress && <div>
        <Rows>
          <Card>
            <TextField
              id="trustAMMFactory"
              label="_ammFactory (address)"
              value={ammFactory}
              onChange={(e) => setAmmFactory(e.target.value)}
            />
            <Button size="lg" color="primary" onClick={trustAMMFactoryTx}>trustAMMFactory</Button>
          </Card>

          <Card>
            <TextField
              id="untrustAMMFactory"
              label="_ammFactory (address)"
              value={ammFactory}
              onChange={(e) => setAmmFactory(e.target.value)}
            />
            <Button size="lg" color="primary" onClick={unTrustAMMFactoryTx}>untrustAMMFactory</Button>
          </Card>
        </Rows>

        <Rows>
          <Card>
            <TextField
              id="withdrawRewards"
              label="_amount (uint256)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button size="lg" color="primary" onClick={withdrawRewardsTx}>withdrawRewards</Button>
          </Card>
          <Card>
            <TextField
              id="marketFactory"
              label="_marketFactory (address)"
              value={marketFactory}
              onChange={(e) => setMarketFactory(e.target.value)}
            />
            <TextField
              id="rewardsPerMarket"
              label="_rewardsPerMarket (uint256)"
              value={rewardsPerMarket}
              onChange={(e) => setRewardsPerMarket(e.target.value)}
            />
            <TextField
              id="rewardDaysPerMarket"
              label="_rewardDaysPerMarket (uint256)"
              value={rewardDaysPerMarket}
              onChange={(e) => setRewardDaysPerMarket(e.target.value)}
            />
            <TextField
              id="earlyDepositBonusRewards"
              label="_earlyDepositBonusRewards (uint256)"
              value={earlyDepositBonusRewards}
              onChange={(e) => setEarlyDepositBonusRewards(e.target.value)}
            />
            <Button size="lg" color="primary" onClick={addRewardsTx}>addRewards</Button>
          </Card>
        </Rows>
      </div> }
    </Container>
  )
}

export default SafeApp
