import Layout from "@/components/Layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  printerModel: z.string().min(1, "Printer model is required"),
  operatingSystem: z.enum(["Windows 10", "Windows 11", "macOS", "Other"], {
    required_error: "Please select an operating system",
  }),
  issueDescription: z.string().min(10, "Description must be at least 10 characters"),
});

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      printerModel: "",
      issueDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would be an API call
    console.log(values);
    setIsSubmitted(true);
  }

  return (
    <Layout>
      <div className="bg-background border-b border-border py-12 px-4 text-center">
        <h1 className="font-heading font-[800] text-4xl mb-4">Get In Touch</h1>
        <p className="text-muted-foreground text-lg">Have a driver question or need personalised support? We're here to help.</p>
      </div>

      <div className="container mx-auto max-w-6xl py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Form */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            {isSubmitted ? (
              <div data-testid="success-message" className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4">Message Sent Successfully!</h3>
                <p className="text-muted-foreground mb-8">Thank you! Our team will get back to you within 24 hours.</p>
                <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full px-8">
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" data-testid="input-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" data-testid="input-email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1 (555) 000-0000" data-testid="input-phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="printerModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Printer Brand & Model *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. HP LaserJet Pro M404n" data-testid="input-printer-model" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingSystem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-os">
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Windows 10">Windows 10</SelectItem>
                              <SelectItem value="Windows 11">Windows 11</SelectItem>
                              <SelectItem value="macOS">macOS</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="issueDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your driver issue in detail..." 
                              className="resize-none" 
                              rows={5}
                              data-testid="textarea-issue"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 font-bold h-12" data-testid="button-submit">
                    Send Message →
                  </Button>
                </form>
              </Form>
            )}
          </div>

          {/* Right Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-border rounded-xl flex items-start gap-4">
              <div className="bg-secondary p-3 rounded-lg text-foreground shrink-0"><Mail className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-foreground">Email</h4>
                <p className="text-muted-foreground text-sm mt-1">support@printkingdriver.com</p>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-border rounded-xl flex items-start gap-4">
              <div className="bg-secondary p-3 rounded-lg text-foreground shrink-0"><Phone className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-foreground">Phone</h4>
                <p className="text-muted-foreground text-sm mt-1">+1 (800) 123-4567</p>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-border rounded-xl flex items-start gap-4">
              <div className="bg-secondary p-3 rounded-lg text-foreground shrink-0"><Clock className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-foreground">Hours</h4>
                <p className="text-muted-foreground text-sm mt-1">Monday–Friday, 9AM–6PM EST</p>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-border rounded-xl flex items-start gap-4 relative overflow-hidden">
              <div className="bg-green-50 p-3 rounded-lg text-green-600 shrink-0"><MessageCircle className="w-5 h-5" /></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-foreground">Live Chat</h4>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Online</span>
                </div>
                <p className="text-muted-foreground text-sm">Available Now</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-blue-800 text-sm leading-relaxed mt-8">
              <span className="font-bold">ℹ️ Response Time:</span> We typically respond to all enquiries within 24 business hours. For urgent issues, please call us directly.
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
