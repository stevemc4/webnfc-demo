import React, { useEffect, useState } from 'react'
import { Flex, Button } from '@chakra-ui/react'

enum NdefState {
  INIT,
  UNSUPPORTED,
  READY,
  SCAN,
  ERROR,
  OK
}

const Index = (): React.ReactElement => {
  const [ndefState, setNdefState] = useState(NdefState.INIT)
  const [ndefData, setNdefData] = useState('')

  // eslint-disable-next-line no-undef
  const handleNdefReading = (event: NDEFReadingEvent) => {
    setNdefData(event.serialNumber)
    setNdefState(NdefState.OK)
    fetch('/api/ndef', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ndefId: event.serialNumber
      })
    })
    setTimeout(() => setNdefState(NdefState.SCAN), 3000)
  }

  const handleNdefError = (): void => {
    setNdefState(NdefState.ERROR)
    setTimeout(() => setNdefState(NdefState.SCAN), 3000)
  }

  const ndefInit = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ndef = new window.NDEFReader()
    await ndef.scan()
    setNdefState(NdefState.SCAN)

    ndef.addEventListener('reading', handleNdefReading)

    ndef.addEventListener('readingerror', handleNdefError)
  }

  const getNdefState = (): string => {
    switch (ndefState) {
      case NdefState.INIT: return 'Initializing NDEF...'
      case NdefState.ERROR: return 'NDEF ERROR!'
      case NdefState.UNSUPPORTED: return 'NDEF Unsupported'
      case NdefState.READY: return 'NDEF OK'
      case NdefState.SCAN: return 'Scanning...'
      case NdefState.OK: return `Scanned ID: ${ndefData}`
    }
  }

  useEffect(() => {
    if ('NDEFReader' in window) {
      setNdefState(NdefState.READY)
    } else {
      setNdefState(NdefState.UNSUPPORTED)
    }
  }, [])

  return (
    <Flex alignItems="center" justifyContent="center" flexDir="column" minH="100vh">
      {getNdefState()}
      {ndefState === NdefState.READY && (
        <Button onClick={ndefInit} mt="4">Start NDEF Reader</Button>
      )}
    </Flex>
  )
}

export default Index
