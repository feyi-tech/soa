import { 
  Box, Divider, Flex, HStack, Text, VStack, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useAccountInfo from '../hooks/useAccountInfo'
import numFormat from './utils/num'

export default function Home() {

  const { user } = { user: {uid: ""}}
  const {
    bankAddress, bankEmail, bankName, bankBranch, 
    accountNumber, accountName, accountAddress, 
    statementDate, startPeriod, endPeriod,
    openingBalance, totalCredit, totalDebit, closingBalance, totalTransactions,
    transactions, isLoading, error
  } = useAccountInfo(user.uid)

  
  return (
    <Box as="div" w="100%">
      <Head>
        <title>Statement of Account</title>
        <meta name="description" content={`Statement of Account`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main" maxWidth={{base: "100%", md: "700px"}} mx="auto" p="15px">
        <Flex fontWeight="500" my="2.5rem" width="100%" flexDirection={{base: "column-reverse", md: "row"}}
          justifyContent={{base: "flex-start", md: "space-between"}} 
          alignItems={{base: "center", md: "flex-end"}}>
          <Flex mb="2rem" flexDirection={{base: "column", md: "row"}}
          justifyContent={{base: "flex-start", md: "space-between"}} 
          alignItems={{base: "center", md: "flex-end"}} width={{base: "100%", md: "60%"}}>
            <Image display="block" src="/logo.png" width={50} height={50} 
            alignSelf="flex-start" />
            <VStack alignItems={{base: "center", md: "flex-start"}}>
              <Text as="div">
                {bankAddress || ""}
              </Text>
              {
                bankEmail?
                <Text as="div">
                  {bankEmail}
                </Text>
                : null
              }
            </VStack>
          </Flex>
          <HStack w={{base: "100%", md: "40%"}} justifyContent={{base: "center", md: "flex-end"}}>
            <Text as="div" textTransform="uppercase" fontWeight="bold" 
              fontSize={{base: "19px", md: "17px"}} mb={{base: "2rem", md: "0px"}}>
              Statement of Account
            </Text>
          </HStack>
        </Flex>

        <Flex mb="2rem" width="100%" flexDirection={{base: "column", md: "row"}} fontWeight="600"
          justifyContent={{base: "flex-start", md: "space-between"}} 
          alignItems={{base: "flex-start", md: "flex-end"}}>
          <HStack width={{base: "100%", md: "50%"}}>
            <VStack alignItems={{base: "flex-start", md: "flex-start"}}>
              <HStack>
                <Text as="div" mr="0.5rem">
                  Account Number:
                </Text>
                <Text as="div">
                  {accountNumber}
                </Text>
              </HStack>
              <HStack>
                <Text as="div" mr="0.5rem">
                  Statement Date:
                </Text>
                <Text as="div">
                  {(() => {
                    var newDate = new Date()
                    newDate.setTime(statementDate * 1000)
                    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
                  })()}
                </Text>
              </HStack>
              <HStack>
                <Text as="div" mr="0.5rem">
                  Period Covered:
                </Text>
                <Text as="div">
                  {(() => {
                    var newDate = new Date()
                    newDate.setTime(startPeriod * 1000)
                    var start = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`

                    newDate = new Date()
                    newDate.setTime(endPeriod * 1000)
                    var end = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`

                    return `${start} to ${end}`
                  })()}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack w={{base: "100%", md: "50%"}} justifyContent={{base: "center", md: "flex-end"}}>
          </HStack>
        </Flex>

        <Flex width="100%" flexDirection={{base: "column", md: "row"}} fontWeight="600"
          justifyContent={{base: "flex-start", md: "space-between"}} 
          alignItems={{base: "flex-start", md: "flex-end"}}>
          <HStack width={{base: "100%", md: "50%"}}>
            <VStack alignItems={{base: "flex-start", md: "flex-start"}}>
                <Text as="div" fontSize="17px">
                  {accountName}
                </Text>
                <Text as="div" mb="1rem">
                  {accountAddress}
                </Text>
                <Text as="div" mb="0.5rem" fontSize="17px">
                  {bankBranch}
                </Text>
            </VStack>
          </HStack>
          <HStack w={{base: "100%", md: "50%"}} justifyContent={{base: "flex-start", md: "flex-end"}}>
            <VStack alignItems={{base: "flex-start", md: "flex-start"}}>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Opening Balance:
                  </Text>
                  <Text as="div">
                    {numFormat(openingBalance, 2, 2)}
                  </Text>
                </HStack>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Total Credit:
                  </Text>
                  <Text as="div">
                    {numFormat(totalCredit, 2, 2)}
                  </Text>
                </HStack>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Total Debit:
                  </Text>
                  <Text as="div">
                    {numFormat(totalDebit, 2, 2)}
                  </Text>
                </HStack>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Closing Balance:
                  </Text>
                  <Text as="div">
                    {numFormat(closingBalance, 2, 2)}
                  </Text>
                </HStack>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Account Type:
                  </Text>
                  <Text as="div">
                    Current Account
                  </Text>
                </HStack>
                <HStack>
                  <Text as="div" mr="0.5rem">
                    Number of Trasactions:
                  </Text>
                  <Text as="div">
                    {numFormat(totalTransactions)}
                  </Text>
                </HStack>
            </VStack>
          </HStack>
        </Flex>

        <Box mt="2.5rem" fontWeight="600">
          <Text>
            Transactions
          </Text>
          <Divider />
          <TableContainer>
            <Table size="sm" variant='striped' colorScheme='teal'>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Credit</Th>
                  <Th>Dedit</Th>
                  <Th>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  transactions.map(({
                    date, description, amount, isCredit, balance
                  }, index) => (
                    <Tr key={index}>
                      <Td>
                        {(() => {
                          var newDate = new Date()
                          newDate.setTime(date * 1000)
                          return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
                        })()}
                      </Td>
                      <Td>{description}</Td>
                      <Td>{numFormat(isCredit? amount : 0, 2, 2)}</Td>
                      <Td>{numFormat(!isCredit? amount : 0, 2, 2)}</Td>
                      <Td>{numFormat(balance, 2, 2)}</Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box w="100%" h="120px">

      </Box>
    </Box>
  )
}
