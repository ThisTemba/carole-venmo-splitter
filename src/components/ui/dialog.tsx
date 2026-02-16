import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"

interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean
  backdrop?: boolean
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const { children, portalled = true, backdrop = true, ...rest } = props

    return (
      <Portal disabled={!portalled}>
        {backdrop && <ChakraDialog.Backdrop />}
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest} asChild={false}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    )
  }
)

export const DialogRoot = ChakraDialog.Root
export const DialogFooter = ChakraDialog.Footer
export const DialogHeader = ChakraDialog.Header
export const DialogBody = ChakraDialog.Body
export const DialogTitle = ChakraDialog.Title
export const DialogActionTrigger = ChakraDialog.ActionTrigger
export const DialogCloseTrigger = ChakraDialog.CloseTrigger
