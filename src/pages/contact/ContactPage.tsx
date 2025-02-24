
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
