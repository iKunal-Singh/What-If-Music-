
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Youtube, Instagram, Twitter } from "lucide-react";
import AdBanner from "@/components/common/AdBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About BeatWave</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Free beats, remixes, and cover art for content creators worldwide. 
              Making music accessible for everyone.
            </p>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="mb-4">
              BeatWave started with a simple idea: to provide high-quality music resources to content creators 
              without the barrier of expensive licensing fees.
            </p>
            <p className="mb-4">
              As a YouTube creator myself, I understood the challenge of finding good music that wouldn't 
              trigger copyright strikes. That's why I began creating beats and remixes specifically designed 
              for content creators.
            </p>
            <p>
              Today, BeatWave offers hundreds of beats, remixes, and cover art designs for free download, 
              supported by our ad revenue model that keeps everything accessible while supporting our continued 
              creative work.
            </p>
          </div>
        </div>
      </section>
      
      <AdBanner type="content" className="container mx-auto py-8" />
      
      {/* How It Works Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h2>
            
            <div className="space-y-8">
              <div className="bg-card border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">1. Browse & Preview</h3>
                <p className="text-muted-foreground">
                  Explore our extensive library of beats, remixes, and cover art. Use the filters to find 
                  exactly what you need for your project, and preview everything before downloading.
                </p>
              </div>
              
              <div className="bg-card border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">2. Download</h3>
                <p className="text-muted-foreground">
                  Choose your preferred download method: either view a short ad or subscribe to our newsletter. 
                  This helps support our work while keeping all content free for you.
                </p>
              </div>
              
              <div className="bg-card border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">3. Create</h3>
                <p className="text-muted-foreground">
                  Use our beats and art in your non-commercial content with proper attribution. We provide 
                  clear licensing information with each download so you know exactly how you can use the content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions about licensing, custom beats, or anything else? We'd love to hear from you!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Mail size={18} />
                Contact Us
              </Button>
              
              <Button size="lg" variant="outline" className="gap-2">
                <Youtube size={18} />
                YouTube
              </Button>
              
              <Button size="lg" variant="outline" className="gap-2">
                <Instagram size={18} />
                Instagram
              </Button>
              
              <Button size="lg" variant="outline" className="gap-2">
                <Twitter size={18} />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
