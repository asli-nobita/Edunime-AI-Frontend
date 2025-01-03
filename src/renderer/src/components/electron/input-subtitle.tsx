"use client"

import { LuBell, LuSend, LuMic, LuMicOff, LuHand, LuX } from "react-icons/lu"
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react"
import { useInputSubtitle } from '@/hooks/electron/use-input-subtitle'
import { useDraggable } from '@/hooks/electron/use-draggable'
import { inputSubtitleStyles } from './electron-style'
import { useState, useEffect, ChangeEvent } from 'react'

export function InputSubtitle({ isPet = false }) {
  const {
    inputText,
    setInputText,
    handleSend,
    handleKeyPress,
    handleCompositionStart,
    handleCompositionEnd,
    handleInterrupt,
    handleMicToggle,
    lastAIMessage,
    hasAIMessages,
    aiState,
    micOn
  } = useInputSubtitle()

  const { 
    elementRef, 
    isDragging, 
    handleMouseDown, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useDraggable({ 
    isPet,
    componentId: 'input-subtitle'
  })

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isPet) {
      const cleanup = (window.api as any)?.onToggleInputSubtitle(() => {
        if (isVisible) {
          handleClose()
        } else {
          handleOpen()
        }
      })
      return () => cleanup?.()
    }
    return () => {}
  }, [isPet, isVisible])

  const handleOpen = () => {
    setIsVisible(true)
  }

  const handleClose = () => {
    // if (isPet) {
    //   (window.api as any)?.updateComponentHover('input-subtitle', false)
    // }
    setIsVisible(false)
  }

  useEffect(() => {
    ;(window as any).inputSubtitle = {
      open: handleOpen,
      close: handleClose
    }

    return () => {
      delete (window as any).inputSubtitle
    }
  }, [isPet])

  if (!isVisible) return null

  return (
    <Box
      ref={elementRef}
      {...inputSubtitleStyles.container}
      {...inputSubtitleStyles.draggableContainer(isDragging)}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box {...inputSubtitleStyles.box}>
        <IconButton
          aria-label="Close subtitle"
          onClick={handleClose}
          {...inputSubtitleStyles.closeButton}
        >
          <LuX size={12} />
        </IconButton>

        {hasAIMessages && (
          <VStack
            minH={lastAIMessage ? "32px" : "0px"}
            {...inputSubtitleStyles.messageStack}
          >
            {lastAIMessage && (
              <Text {...inputSubtitleStyles.messageText}>
                {lastAIMessage}
              </Text>
            )}
          </VStack>
        )}

        <Box {...inputSubtitleStyles.statusBox}>
          <Flex align="center" justify="space-between" color="whiteAlpha.700">
            <Flex align="center" gap="2">
              <LuBell size={16} />
              <Text {...inputSubtitleStyles.statusText}>
                {aiState}
              </Text>
            </Flex>
            
            <Flex gap="2">
              <IconButton
                aria-label="Toggle microphone"
                onClick={handleMicToggle}
                {...inputSubtitleStyles.iconButton}
              >
                {micOn ? <LuMic size={16} /> : <LuMicOff size={16} />}
              </IconButton>
              <IconButton
                aria-label="Interrupt"
                onClick={handleInterrupt}
                {...inputSubtitleStyles.iconButton}
              >
                <LuHand size={16} />
              </IconButton>
            </Flex>
          </Flex>
        </Box>

        <Box {...inputSubtitleStyles.inputBox}>
          <Stack direction="row" gap="2" p="2">
            <Input
              value={inputText}
              onChange={(e) => setInputText({ target: { value: e.target.value } } as ChangeEvent<HTMLInputElement>)}
              onKeyDown={handleKeyPress}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder="Type your message..."
              {...inputSubtitleStyles.input}
            />
            <Button
              onClick={handleSend}
              {...inputSubtitleStyles.sendButton}
            >
              <LuSend size={16} />
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
