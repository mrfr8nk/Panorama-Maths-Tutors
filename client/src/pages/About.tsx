import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              About Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Panorama Maths Tutors is dedicated to providing exceptional mathematics education 
              for students at all levels across Zimbabwe and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="backdrop-blur-md bg-card/80 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-md bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">Our Mission</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower students with strong mathematical foundations and 
                  problem-solving skills that prepare them for academic excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-card/80 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-md bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">Our Vision</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the leading mathematics education provider, 
                  making quality tutoring accessible to every student.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-card/80 text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-md bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">Our Values</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Excellence, integrity, innovation, and student-centered learning 
                  guide everything we do.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="backdrop-blur-md bg-card/80">
              <CardHeader>
                <h2 className="font-heading font-bold text-2xl text-foreground">Why Choose Us</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Expert Tutors</h4>
                    <p className="text-muted-foreground">
                      Our team consists of experienced educators with proven track records in mathematics education.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Flexible Learning</h4>
                    <p className="text-muted-foreground">
                      Choose from online tutorials, evening sessions, one-on-one lessons, or home visits.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Comprehensive Resources</h4>
                    <p className="text-muted-foreground">
                      Access quality notes, video tutorials, and practice materials for all course levels.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Proven Results</h4>
                    <p className="text-muted-foreground">
                      Our students consistently achieve excellent results in their examinations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
