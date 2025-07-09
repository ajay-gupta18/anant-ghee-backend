import { Injectable } from '@nestjs/common';
const Razorpay = require('razorpay');

@Injectable()
export class RazorpayService {
  private readonly razorpay: typeof Razorpay;

  constructor() {
    // this.razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_ID_KEY,
    //   key_secret: process.env.RAZORPAY_SECRET_KEY
    // });
  }

  async createOrder(amount: number, currency: string = "INR") {
    const options: typeof Razorpay.OrderCreateRequestBody = {
      amount: amount * 100,
      currency,
      receipt: `rcpt_${Date.now()}`
    };

    try {
      return await this.razorpay.orders.create(options);
    }catch(error) {
      console.log("Error while creating razor pay order", error);
    }
  }

  validateSignature(orderId: string, paymentId: string, razorpaySignature: string): boolean {
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  }
}
