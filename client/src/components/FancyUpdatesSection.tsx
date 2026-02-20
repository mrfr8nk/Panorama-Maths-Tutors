import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Star, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function FancyUpdatesSection() {
  const { data: updates, isLoading } = useQuery<any[]>({
    queryKey: ["/api/updates"],
  });

  if (isLoading || !updates || updates.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Megaphone className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'feature': return "bg-yellow-500/10 border-yellow-500/20";
      case 'alert': return "bg-red-500/10 border-red-500/20";
      default: return "bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-transparent to-accent/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Megaphone className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading">Latest Updates</h2>
            <p className="text-muted-foreground text-sm">Stay informed with the latest news from Panorama</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update, index) => (
            <motion.div
              key={update._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full border backdrop-blur-sm bg-background/50 hover:shadow-lg transition-all duration-300 ${getTypeStyles(update.type)}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-full bg-background/80 shadow-sm">
                      {getIcon(update.type)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(update.createdAt), "MMM d")}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{update.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {update.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
