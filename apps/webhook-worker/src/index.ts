require("dotenv").config();

import Stripe from "stripe";

const stripe: Stripe = new (Stripe as any)(
  process.env.STRIPE_SECRET_KEY as string
);

import { Worker, Job } from "bullmq";
import Redis, { RedisOptions } from "ioredis";
import { prisma } from "./database";
export const redis = new Redis(process.env.REDIS_URL as string);

const worker = new Worker(
  "webhooks",
  async (job: Job) => {
    // Associate by UTM campaign

    // Associate by existing email

    // Create a new email

    console.log("Processing webhook job");
    // Optionally report some progress
    console.log(JSON.stringify(job.data, null, "\t"));

    const webhookType = job.data.type;
    if (webhookType === "checkout.session.completed") {
      const event = job.data.data.object;
      const userId = event.client_reference_id;

      const customerId = event.customer;
      const customerDetails = event.customer_details;
      const email = customerDetails.email;
      const paymentStatus = event.payment_status;
      const subscriptionId = event.subscription;
      const fullSubscription = await stripe.subscriptions.retrieve(
        subscriptionId
      );
      console.log("Full subscription");
      console.log(fullSubscription);

      const planName = fullSubscription["plan"].nickname;
      const planActive = fullSubscription["plan"].active;

      let user;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
      } else {
        user = await prisma.user.findUnique({ where: { email } });
      }
      if (user) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            ...user.data,
            plan: { name: planName, active: planActive },
          },
        });
        return { success: true };
      } else {
        return { success: false };
      }
    }
  },

  {
    connection: redis,
  }
);
