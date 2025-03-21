
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { Card, CardContent } from "@/components/ui/card";

// Stripe publishable key - this is safe to be in client-side code
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Qx8ZW2VssJgwMDKBMlrqlCvWJGssJw2DhQxKBYFetlue4dNUGESfKDVz9dOgThYSX1O4DvCWYAZIcQOWU8ebfF100JuLCHbao";

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Configure the appearance of Stripe Elements
const appearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#22c55e',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    spacingUnit: '4px',
    borderRadius: '4px',
  },
};

// Memoize the options to prevent unnecessary re-renders
const options = { appearance };

const StripeConfig = () => {
  return (
    <Elements stripe={stripePromise} options={options}>
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Payment Details</h3>
          <CheckoutForm />
        </CardContent>
      </Card>
    </Elements>
  );
};

export default StripeConfig;
