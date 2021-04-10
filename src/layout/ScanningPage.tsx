import React from 'react'
import { Flex } from '@chakra-ui/react'

interface Props {
  children: React.ReactElement | React.ReactElement[] | string | number
}

const ScanningPage = ({ children }: Props): React.ReactElement => {
  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" minH="100vh" p="4">
      {children}
    </Flex>
  )
}

export default ScanningPage
