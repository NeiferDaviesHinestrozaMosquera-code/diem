import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, FileText, Users,
  BarChart3, PieChart, Activity, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subscribeToQuoteRequests } from '@/services/firebase';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, change, color, isLoading }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  change?: string;
  color: string;
  isLoading?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-muted"></div>
              <div className="w-12 h-4 bg-muted rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {change && (
                <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {change}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-muted-foreground text-sm">{title}</div>
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export function Dashboard() {
  const [stats, setStats] = useState({
    services: 12,
    projects: 6,
    quotes: 0,
    pendingQuotes: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to quote updates
    const unsubscribe = subscribeToQuoteRequests((quotes) => {
      setStats(prev => ({
        ...prev,
        quotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
      }));
      setRecentQuotes(quotes.slice(0, 5));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'quoted': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Services"
          value={stats.services}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          isLoading={isLoading}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Projects"
          value={stats.projects}
          color="bg-gradient-to-br from-green-500 to-green-600"
          isLoading={isLoading}
        />
        <StatCard
          icon={Users}
          title="Quote Requests"
          value={stats.quotes}
          change="+12%"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          isLoading={isLoading}
        />
        <StatCard
          icon={Activity}
          title="Pending Quotes"
          value={stats.pendingQuotes}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="text-center relative z-10">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-1">Revenue Chart</p>
                  <p className="text-muted-foreground/60 text-sm mb-3">Coming soon</p>
                  <Button variant="outline" size="sm" disabled>
                    Configure Chart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Quote Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
                <div className="text-center relative z-10">
                  <PieChart className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-1">Status Distribution</p>
                  <p className="text-muted-foreground/60 text-sm mb-3">Coming soon</p>
                  <Button variant="outline" size="sm" disabled>
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Quote Requests
            </CardTitle>
            <Link to="/admin/inquiries">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : recentQuotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">No recent quote requests</p>
                <p className="text-sm">New requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuotes.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to="/admin/inquiries">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-primary/20">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{quote.fullName}</p>
                            <p className="text-sm text-muted-foreground truncate">{quote.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                          <span className="text-sm text-muted-foreground hidden sm:block">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/services">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary/50">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Services</div>
                    <div className="text-xs text-muted-foreground">Add or edit services</div>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/projects">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary/50">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Projects</div>
                    <div className="text-xs text-muted-foreground">Update portfolio</div>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/testimonials">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary/50">
                  <Users className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Testimonials</div>
                    <div className="text-xs text-muted-foreground">Client feedback</div>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary/50">
                  <Activity className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Site Settings</div>
                    <div className="text-xs text-muted-foreground">Configure website</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
