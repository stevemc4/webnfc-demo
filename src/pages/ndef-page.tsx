import React, { useEffect, useState } from 'react'
import { Flex, Button, Heading, Text } from '@chakra-ui/react'
import { WarningIcon, CheckCircleIcon, CopyIcon } from '@chakra-ui/icons'

import Layout from '../layout/ScanningPage'

enum NdefState {
  INIT,
  UNSUPPORTED,
  READY,
  SCANNING,
  ERROR,
  CHECKING,
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
    setTimeout(() => setNdefState(NdefState.SCANNING), 3000)
  }

  const handleNdefError = (): void => {
    setNdefState(NdefState.ERROR)
    setTimeout(() => setNdefState(NdefState.SCANNING), 3000)
  }

  const ndefInit = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ndef = new window.NDEFReader()
    await ndef.scan()
    setNdefState(NdefState.SCANNING)

    ndef.addEventListener('reading', handleNdefReading)

    ndef.addEventListener('readingerror', handleNdefError)
  }

  const getNdefState = (): string => {
    switch (ndefState) {
      case NdefState.INIT: return 'Initializing NDEF...'
      case NdefState.ERROR: return 'NDEF ERROR!'
      case NdefState.UNSUPPORTED: return 'NDEF Unsupported'
      case NdefState.READY: return 'NDEF OK'
      case NdefState.SCANNING: return 'Scanning...'
      case NdefState.CHECKING: return 'Checking NDEF ID...'
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

  if (ndefState === NdefState.UNSUPPORTED) {
    return (
      <Layout>
        <WarningIcon w="24" h="24" color="yellow.500" />
        <Heading mt="8" textAlign="center">Tidak Mendukung Web NFC</Heading>
        <Text as="p" textAlign="center" mt="1">Browser ini tidak mendukung fitur Web NFC, silakan gunakan browser lain.</Text>
      </Layout>
    )
  }

  if (ndefState === NdefState.READY) {
    return (
      <Layout>
        <CheckCircleIcon w="24" h="24" color="green.500" />
        <Heading mt="8" textAlign="center">Web NFC Siap Digunakan</Heading>
        <Text as="p" textAlign="center" mt="1">Browser ini dapat menggunakan fitur Web NFC!</Text>
        <Button onClick={ndefInit} mt="4" colorScheme="green">Mulai</Button>
      </Layout>
    )
  }

  if (ndefState === NdefState.SCANNING) {
    return (
      <Layout>
        <Flex w="24" h="24" borderRadius="full" alignItems="center" justifyContent="center" bgColor="blue.500">
          <CopyIcon w="12" h="12" color="white" />
        </Flex>
        <Heading mt="8" textAlign="center">Tempelkan Kartumu</Heading>
        <Text as="p" textAlign="center" mt="1">Tempelkan kartu RFID atau NFC di belakang perangkatmu.</Text>
      </Layout>
    )
  }

  if (ndefState === NdefState.ERROR) {
    return (
      <Layout>
        <WarningIcon w="24" h="24" color="yellow.500" />
        <Heading mt="8" textAlign="center">Kartu Bermasalah</Heading>
        <Text as="p" textAlign="center" mt="1">Pastikan kartumu telah terdaftar dan tidak rusak, dan coba lagi</Text>
      </Layout>
    )
  }

  return (
    <Layout>
      {getNdefState()}
    </Layout>
  )
}

export default Index
