
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/payment/CheckoutForm";

const STRIPE_PUBLISHABLE_KEY = "pk_test_51Qx8ZW2VssJgwMDKBMlrqlCvWJGssJw2DhQxKBYFetlue4dNUGESfKDVz9dOgThYSX1O4DvCWYAZIcQOWU8ebfF100JuLCHbao";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

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

const StripeConfig = () => {
  return (
    <Elements stripe={stripePromise} options={{ appearance }}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeConfig;
