import { Box, Flex, Stack } from "@chakra-ui/react";
import { groupItemsByReceipt, type PersonItem } from "../utils/calculations";

interface PersonBreakdownProps {
  items: PersonItem[];
  total: string;
}

// One person's share of each item, laid out like a receipt per receipt
export default function PersonBreakdown({ items, total }: PersonBreakdownProps) {
  return (
    <Box fontFamily="mono" fontSize="sm" px={4}>
      {Object.entries(groupItemsByReceipt(items)).map(([receiptName, receiptItems]) => (
        <Box key={receiptName} mb={3}>
          <Box textAlign="center" borderBottom="1px dashed" borderColor="border" pb={1} mb={2}>
            {receiptName}
          </Box>
          <Stack gap={1}>
            {receiptItems.map((item, idx) => (
              <Flex key={idx} justifyContent="space-between">
                <Box>{item.item.what}</Box>
                <Box>${item.share}</Box>
              </Flex>
            ))}
          </Stack>
          {receiptItems.length > 1 && (
            <Box borderTop="1px dashed" borderColor="border" mt={2} pt={1}>
              <Flex justifyContent="space-between" fontWeight="bold">
                <Box>Subtotal</Box>
                <Box>${receiptItems.reduce((sum, item) => sum + parseFloat(item.share), 0).toFixed(2)}</Box>
              </Flex>
            </Box>
          )}
        </Box>
      ))}
      <Box borderTop="2px solid" borderColor="border.emphasized" mt={2} pt={2}>
        <Flex justifyContent="space-between" fontWeight="bold" fontSize="md">
          <Box>TOTAL</Box>
          <Box>${total}</Box>
        </Flex>
      </Box>
    </Box>
  );
}
