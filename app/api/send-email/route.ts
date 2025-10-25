import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type OrderItem = { name: string; quantity: number; price: number };

type OrderEmailData = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  totalAmount: number;
  items: OrderItem[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderDate: string;
  paymentMethod?: string;
};

type StatusUpdateData = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  courierDetails?: {
    name: string;
    trackingId: string;
    trackingUrl?: string;
  };
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    const {
      SMTP_HOST,
      SMTP_PORT = "587",
      SMTP_SECURE = "false",
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM = "NH360 FASTag <no-reply@nh360fastag.com>",
      SALES_EMAIL = "sales@nh360fastag.com",
    } = process.env as Record<string, string | undefined>

    const transporter = nodemailer.createTransport(
      SMTP_HOST
        ? {
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: SMTP_SECURE === "true",
            auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
          }
        : {
            service: "gmail",
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          }
    )

    await transporter.verify();

    // --- ORDER NOTIFICATION EMAIL ---
    if (type === "order-notification") {
      const orderData = data as OrderEmailData;

      const salesHtml = `
        <h2>New Order Received</h2>
        <p><b>Order ID:</b> ${orderData.orderId}</p>
        <p><b>Customer:</b> ${orderData.customerName} (${orderData.customerEmail})</p>
        <p><b>Phone:</b> ${orderData.phone || "N/A"}</p>
        <p><b>Payment:</b> ${orderData.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Paid (Prepaid)'}</p>
        <p><b>Address:</b> ${orderData.address}, ${orderData.city}, ${orderData.state}, ${orderData.pincode}</p>
        <p><b>Date:</b> ${orderData.orderDate}</p>
        <p><b>Total: ₹${orderData.totalAmount}</b> ₹${orderData.totalAmount}</p>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} x ${item.quantity} @ ₹${item.price}</li>`).join("")}
        </ul>
      `;

      await transporter.sendMail({
        from: SMTP_FROM,
        to: SALES_EMAIL || "sales@nh360fastag.com",
        subject: `New Order/Request from ${orderData.customerName} - #${orderData.orderId}`,
        html: salesHtml,
      });

      const customerHtml = `
        <h2>Thank you for your order!</h2>
        <p>Dear ${orderData.customerName},</p>
        <p>Your order <b>#${orderData.orderId}</b> is confirmed. Here are your order details:</p>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} x ${item.quantity} @ ₹${item.price}</li>`).join("")}
        </ul>
        <p><b>Total Paid:</b> ₹${orderData.totalAmount}</p>
        <p><b>Payment Method:</b> ${orderData.paymentMethod === 'COD' ? 'Cash on Delivery (COD) - Pay on delivery' : 'Paid (Prepaid)'}</p>
        <p><b>Shipping Address:</b> ${orderData.address}, ${orderData.city}, ${orderData.state}, ${orderData.pincode}</p>
        <p>We’ll update you when your order ships.</p>
        <p>Contact support@nh360fastag.com if needed.</p>
      `;

      await transporter.sendMail({
        from: SMTP_FROM,
        to: orderData.customerEmail,
        subject: `Your Request with NH360 FASTag is Confirmed (Ref #${orderData.orderId})`,
        html: customerHtml,
      });

      return NextResponse.json({ success: true, message: "Order emails sent" });
    }

    // --- STATUS UPDATE EMAIL ---
    else if (type === "status-update") {
      const updateData = data as StatusUpdateData;

      const { customerName, customerEmail, orderId, newStatus, courierDetails } = updateData;

      let html = `
        <h2>Order Status Update</h2>
        <p>Dear ${customerName},</p>
        <p>Your order <b>#${orderId}</b> status has been updated to: <b>${newStatus.toUpperCase()}</b>.</p>
      `;

      if (newStatus === "transit" && courierDetails) {
        html += `
          <p><b>Courier:</b> ${courierDetails.name}</p>
          <p><b>Tracking ID:</b> ${courierDetails.trackingId}</p>
          ${courierDetails.trackingUrl ? `<p><a href="${courierDetails.trackingUrl}">Track your shipment</a></p>` : ""}
        `;
      }

      html += `
        <br/><p>For help, contact support@nh360fastag.com.</p>
        <p>— NH360 FASTag</p>
      `;

      await transporter.sendMail({
        from: SMTP_FROM,
        to: customerEmail,
        subject: `Request #${orderId} - Status Updated to ${newStatus}`,
        html,
      });

      return NextResponse.json({ success: true, message: "Status update email sent" });
    }

    // --- UNSUPPORTED TYPE ---
    return NextResponse.json({ success: false, message: "Unsupported email type" }, { status: 400 });

  } catch (error: any) {
    console.error("❌ Error in send-email:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
