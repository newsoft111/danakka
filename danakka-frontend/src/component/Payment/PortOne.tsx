import * as PortOne from '@portone/browser-sdk/v2';


type PayMethod =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'TRANSFER'
  | 'MOBILE'
  | 'GIFT_CERTIFICATE'
  | 'EASY_PAY'
  | 'PAYPAL';

const requestPortOnePayment = async (
	paymentId: string,
	orderName: string,
	totalAmount: number,
	channelKey: string,
	payMethod: PayMethod // Use the PayMethod type here
  ) => {
	
	try {
		const result = await PortOne.requestPayment({
			storeId: 'store-0d0fe347-57a0-4059-bbac-4dadd79b9739', // 가맹점 storeId로 변경해주세요.
			paymentId: paymentId,
			orderName: orderName,
			totalAmount: totalAmount,
			currency: 'CURRENCY_KRW',
			channelKey: channelKey,
			payMethod: payMethod,
		});
		
		return result;

	} catch (error) {
		throw error;
	}
}

export default requestPortOnePayment;