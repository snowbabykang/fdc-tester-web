// Enum for order status
export const ORDER_STATUS = {
    TO_BE_CONFIRMED: 0,
    CONFIRMED: 1,
    CLEARED: 2,
    RECEIPT_PENDING: 3,
    RECEIPT_FINISHED: 4
}

export function getStatusChinese(status) {
    switch (status) {
      case ORDER_STATUS.TO_BE_CONFIRMED:
        return "待确认";
      case ORDER_STATUS.CONFIRMED:
        return "已确认";
      case ORDER_STATUS.CLEARED:
        return "已结算";
      case ORDER_STATUS.RECEIPT_PENDING:
        return "待开票";
      case ORDER_STATUS.RECEIPT_FINISHED:
        return "已开票";
      default:
        console.error("STATUS ERROR");
    }
  }
