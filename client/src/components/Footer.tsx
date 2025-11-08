import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4 text-foreground">Panoramac Maths Tutors</h3>
            <p className="text-muted-foreground text-sm">
              Professional mathematics tutoring for ZIMSEC, Cambridge, and Tertiary level students.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+2637 1369 3824</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>panoramac215@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-primary cursor-pointer hover-elevate p-2 rounded-md -ml-2">
                <SiWhatsapp className="w-5 h-5" />
                <span className="font-medium">WhatsApp Us</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Panoramac Maths Tutors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
